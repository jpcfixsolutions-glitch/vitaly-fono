import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { role } from "./roleSchema.js";
import { v4 as uuid } from "uuid";
import { eq, sql, and } from "drizzle-orm";
import { rolePrivilege } from "../rolePrivilege/rolePrivilegeSchema.js";
import { privilege } from "../privilege/privilegeSchema.js";

/**
 * Obtiene todos los roles disponibles con sus privilegios
 * * @returns {Promise<Array>} Array con todos los roles y sus privilegios
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */
const getAllRoles = async () => {
    try {
        // 1. Obtener todos los roles
        const allRoles = await db.select().from(role).all();

        if (allRoles.length === 0) {
            return [];
        }

        // 2. Obtener TODAS las asignaciones (roleId, privilegeId) en una sola consulta
        const allAssignments = await db.select({
            id_role: rolePrivilege.id_role,
            id_privilege: rolePrivilege.id_privilege,
            name: privilege.name
        }).from(rolePrivilege).leftJoin(privilege, eq(rolePrivilege.id_privilege, privilege.id)).all();

        // 3. Crear un Map para agrupar los privilegios por roleId
        // Esto es mucho más rápido que hacer consultas dentro de un bucle
        const privilegesMap = new Map(); // <roleId, [privId1, privId2, ...]>

        for (const assignment of allAssignments) {
            if (!privilegesMap.has(assignment.id_role)) {
                privilegesMap.set(assignment.id_role, []);
            }
            privilegesMap.get(assignment.id_role).push(assignment.name);
        }

        // 4. Combinar los roles con sus arrays de privilegios
        const rolesWithPrivileges = allRoles.map(r => ({
            ...r,
            privileges: privilegesMap.get(r.id) || []
        }));

        return rolesWithPrivileges;

    } catch (error) {
        console.error(error); // Es bueno loguear el error real
        throw new AppError("Ocurrió un error al obtener los roles.", 500, []);
    }
};

/**
 * Obtiene un rol específico por su ID
 * * @param {string} id - ID del rol a buscar
 * @returns {Promise<Object>} El rol encontrado
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */
const getRoleById = async (id) => {
    try {
        // 1. Encontrar el rol
        const roleFound = await db.select().from(role).where(eq(role.id, id)).get();
        if (!roleFound) return undefined;

        // 2. Encontrar sus privilegios asignados
        const assigned = await db.select({
            id_privilege: rolePrivilege.id_privilege,
            name: privilege.name
        })
            .from(rolePrivilege)
            .leftJoin(privilege, eq(rolePrivilege.id_privilege, privilege.id))
            .where(eq(rolePrivilege.id_role, id));

        // 3. Mapear los IDs
        const privilegeIds = assigned.map(p => p.name);

        // 4. Devolver el rol con el array de IDs
        return {
            ...roleFound,
            privileges: privilegeIds
        };

    } catch (error) {
        throw new AppError("Ocurrió un error al obtener el rol", 500, []);
    }
};

/**
 * Obtiene un rol específico por su nombre
 * 
 * @param {string} name - Nombre del rol a buscar
 * @returns {Promise<Object>} El rol encontrado
 * @throws {AppError} Si ocurre un error al consultar la base de datos
 */

const getRoleByName = async (name) => {
    try {
        const roleFound = await db.select().from(role).where(eq(sql`LOWER(${role.name})`, sql`LOWER(${name})`)).get();
        return roleFound;
    } catch (error) {
        throw new AppError("Ocurrió un error al obtener el rol.", 500, []);
    }
};

/**
 * Crea un nuevo rol en la base de datos y asigna sus privilegios
 * * @param {Object} dataRole - Datos del rol
 * @param {Array<string>} [privilegeIds=[]] - Array de IDs de privilegios
 * @returns {Promise<Object>} El rol creado
 */
const createRole = async (dataRole, privilegeIds) => {
    try {
        // Usamos una transacción para asegurar la atomicidad
        const insertedRole = await db.transaction(async (tx) => {
            // 1. Crear el nuevo rol
            const newRoleData = {
                id: uuid(),
                ...dataRole
            };
            const [insertedRole] = await tx.insert(role).values(newRoleData).returning();

            // 2. Asignar privilegios (si se pasaron)
            if (privilegeIds && privilegeIds.length > 0) {
                const assignments = privilegeIds.map(privId => ({
                    id_role: insertedRole.id,
                    id_privilege: privId
                }));

                await tx.insert(rolePrivilege).values(assignments);
            }

            return insertedRole;
        });

        // Retornamos el rol creado (sin los privilegios, o podríamos volver a consultarlo)
        return insertedRole;

    } catch (error) {
        // Manejar error de privilegio no existente (foreign key constraint)
        if (error.message.includes("FOREIGN KEY constraint failed")) {
            throw new AppError("Uno o más privilegios no son válidos.", 400, []);
        }
        throw new AppError("Ocurrió un error al crear el rol.", 500, []);
    }
};

/**
 * Actualiza un rol en la base de datos y sincroniza sus privilegios
 * * @param {string} id - ID del rol a actualizar
 * @param {Object} dataRole - Datos del rol a actualizar
 * @param {Array<string>} [privilegeIds] - Array de IDs de privilegios. 
 * Si es undefined, no se tocan.
 * Si es un array (vacío o no), se sincronizan.
 * @returns {Promise<Object>} El rol actualizado
 */
const updateRole = async (id, dataRole, privilegeIds) => {
    try {
        const updatedRole = await db.transaction(async (tx) => {
            // 1. Actualizar los datos del rol
            const [updatedRole] = await tx.update(role).set(dataRole).where(eq(role.id, id)).returning();

            // 2. Sincronizar privilegios (SOLO si 'privilegeIds' no es undefined)
            if (privilegeIds !== undefined) {
                // a. Borrar TODOS los privilegios antiguos de este rol
                await tx.delete(rolePrivilege).where(eq(rolePrivilege.id_role, id));

                // b. Insertar los nuevos privilegios (si el array no está vacío)
                if (privilegeIds.length > 0) {
                    const assignments = privilegeIds.map(privId => ({
                        id_role: id,
                        id_privilege: privId
                    }));
                    await tx.insert(rolePrivilege).values(assignments);
                }
            }

            return updatedRole;
        });

        return updatedRole;

    } catch (error) {
        if (error.message.includes("FOREIGN KEY constraint failed")) {
            throw new AppError("Uno o más privilegios no son válidos.", 400, []);
        }
        throw new AppError("Ocurrió un error al actualizar el rol.", 500, []);
    }
};

/**
 * Elimina un rol de la base de datos (eliminación lógica)
 * 
 * @param {string} id - ID del rol a eliminar
 * @returns {Promise<Object>} El rol eliminado
 * @throws {AppError} Si ocurre un error al eliminar el rol
 */
const deleteRole = async (id) => {
    return await db
        .update(role)
        .set({
            status: "Inactivo",
            updated_at: new Date().toISOString()
        })
        .where(eq(role.id, id))
        .returning();
};

export const roleService = {
    getAllRoles,
    getRoleById,
    getRoleByName,
    createRole,
    updateRole,
    deleteRole
};