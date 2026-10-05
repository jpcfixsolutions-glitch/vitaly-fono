import "dotenv/config";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { createClient } from "@libsql/client";

const { URL_DB, TOKEN_DB, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, ADMIN_LAST_NAME } = process.env;

if (!URL_DB) throw new Error("Falta URL_DB en el entorno.");
const hasAdminCredentials = Boolean(ADMIN_EMAIL && ADMIN_PASSWORD);

const client = createClient({ url: URL_DB, authToken: TOKEN_DB });
const now = new Date().toISOString();

const schema = [
  `CREATE TABLE IF NOT EXISTS rol (id TEXT PRIMARY KEY NOT NULL, nombre TEXT NOT NULL, descripcion TEXT, estado TEXT NOT NULL DEFAULT 'Activo', creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS privilegio (id TEXT PRIMARY KEY NOT NULL, nombre TEXT NOT NULL, descripcion TEXT, estado TEXT NOT NULL DEFAULT 'Activo', creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS Usuario (id TEXT PRIMARY KEY NOT NULL, id_rol TEXT NOT NULL REFERENCES rol(id), nombre TEXT NOT NULL, apellido TEXT NOT NULL, email TEXT NOT NULL UNIQUE, contrasena TEXT NOT NULL, estado TEXT NOT NULL DEFAULT 'Activo', ultimo_login TEXT, creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS rol_privilegio (id_rol TEXT NOT NULL REFERENCES rol(id), id_privilegio TEXT NOT NULL REFERENCES privilegio(id), creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id_rol, id_privilegio))`,
  `CREATE TABLE IF NOT EXISTS DiagramaCalendario (id TEXT PRIMARY KEY NOT NULL, dia TEXT NOT NULL, horario_desde TEXT NOT NULL, horario_hasta TEXT NOT NULL, id_usuario TEXT NOT NULL REFERENCES Usuario(id), creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS ObraSocial (id TEXT PRIMARY KEY NOT NULL, nombre TEXT NOT NULL, estado TEXT NOT NULL DEFAULT 'Activo', id_usuario TEXT NOT NULL REFERENCES Usuario(id), creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS TipoDocumento (id TEXT PRIMARY KEY NOT NULL, nombre TEXT NOT NULL, estado TEXT NOT NULL DEFAULT 'Activo', id_usuario TEXT NOT NULL REFERENCES Usuario(id), creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS metodoPago (id TEXT PRIMARY KEY NOT NULL, nombre TEXT NOT NULL, estado TEXT NOT NULL DEFAULT 'Activo', id_usuario TEXT NOT NULL REFERENCES Usuario(id), creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS Servicio (id TEXT PRIMARY KEY NOT NULL, nombre TEXT NOT NULL, descripcion TEXT, precio INTEGER NOT NULL, estado TEXT NOT NULL DEFAULT 'Activo', id_usuario TEXT NOT NULL REFERENCES Usuario(id), creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS Paciente (id TEXT PRIMARY KEY NOT NULL, nombre TEXT NOT NULL, apellido TEXT NOT NULL, id_tipo_documento TEXT NOT NULL REFERENCES TipoDocumento(id), numero_documento TEXT NOT NULL UNIQUE, telefono INTEGER NOT NULL, fecha_nacimiento TEXT, id_obra_social TEXT REFERENCES ObraSocial(id), estado TEXT NOT NULL DEFAULT 'Activo', email TEXT, direccion TEXT, id_usuario TEXT NOT NULL REFERENCES Usuario(id), creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS Turno (id TEXT PRIMARY KEY NOT NULL, nombre TEXT NOT NULL, apellido TEXT NOT NULL, telefono TEXT NOT NULL, modalidad TEXT NOT NULL, fecha TEXT NOT NULL, id_tipo_documento TEXT NOT NULL REFERENCES TipoDocumento(id), numero_documento TEXT NOT NULL, paciente_nuevo INTEGER NOT NULL DEFAULT 0, estado TEXT NOT NULL DEFAULT 'Activo', id_usuario TEXT NOT NULL REFERENCES Usuario(id), creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS sesion (id TEXT PRIMARY KEY NOT NULL, id_paciente TEXT NOT NULL, id_usuario TEXT NOT NULL, id_servicio TEXT, id_turno TEXT, fecha TEXT NOT NULL, notas_clinicas TEXT, estado TEXT NOT NULL DEFAULT 'Activo', creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS TokenRefresco (id TEXT PRIMARY KEY NOT NULL, id_usuario TEXT NOT NULL REFERENCES Usuario(id), token_hasheado TEXT NOT NULL UNIQUE, expira_en TEXT NOT NULL, creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS PrimeraEntrevista (id TEXT PRIMARY KEY NOT NULL, id_paciente TEXT NOT NULL REFERENCES Paciente(id), id_usuario TEXT NOT NULL REFERENCES Usuario(id), fecha TEXT NOT NULL, dinamicas_familiares TEXT, antecedentes_perinatal TEXT, desarrollo_general TEXT, enfermedades_alergias TEXT, historia_familiar_patologias TEXT, personalidad_descripcion TEXT, motivo_consulta TEXT, genograma TEXT, estado TEXT NOT NULL DEFAULT 'Activo', creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS uniq_primeraentrevista_id_paciente ON PrimeraEntrevista(id_paciente)`,
  `CREATE TABLE IF NOT EXISTS InformacionAdicionalPaciente (id TEXT PRIMARY KEY NOT NULL, id_entrevista TEXT NOT NULL REFERENCES PrimeraEntrevista(id), estado_civil TEXT, segundo_telefono INTEGER, con_quien_vive TEXT, profesion TEXT, derivacion TEXT, a_realizado_terapia INTEGER DEFAULT 0, cuanto_tiempo_realizo_terapia TEXT, motivo_terapia_dejada TEXT, corriente TEXT, creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS InformacionAdicionalAntecendentesAdultos (id TEXT PRIMARY KEY NOT NULL, id_entrevista TEXT NOT NULL REFERENCES PrimeraEntrevista(id), patologias_enfermedades TEXT, medicacion TEXT, consumo_sustancias_alcohol TEXT, pasatiempo_deportes TEXT, pensamientos_negativos TEXT, abusos_maltratos TEXT, creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS Madre (id TEXT PRIMARY KEY NOT NULL, id_entrevista TEXT NOT NULL REFERENCES PrimeraEntrevista(id), nombre TEXT, edad TEXT, vive INTEGER, profesion_estudios TEXT, horarios_laborales TEXT, creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS Padre (id TEXT PRIMARY KEY NOT NULL, id_entrevista TEXT NOT NULL REFERENCES PrimeraEntrevista(id), nombre TEXT, edad TEXT, vive INTEGER, profesion_estudios TEXT, horarios_laborales TEXT, creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS Hermano (id TEXT PRIMARY KEY NOT NULL, id_entrevista TEXT NOT NULL REFERENCES PrimeraEntrevista(id), nombre TEXT, edad TEXT, estudios TEXT, creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS Conviviente (id TEXT PRIMARY KEY NOT NULL, id_entrevista TEXT NOT NULL REFERENCES PrimeraEntrevista(id), convivencia_domestica TEXT, convivencia_no_domestica TEXT, creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS Escolaridad (id TEXT PRIMARY KEY NOT NULL, id_entrevista TEXT NOT NULL REFERENCES PrimeraEntrevista(id), anio_escolaridad TEXT, curso_actual TEXT, orientacion TEXT, colegio TEXT, repitio_curso INTEGER DEFAULT 0, motivo_repeticion TEXT, cambios_colegio INTEGER DEFAULT 0, motivo_cambios_colegio TEXT, nivel_inicial TEXT, nivel_primario TEXT, nivel_secundario TEXT, observaciones_generales TEXT, creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS CierreTratamiento (id TEXT PRIMARY KEY NOT NULL, id_paciente TEXT NOT NULL REFERENCES Paciente(id), tipo TEXT NOT NULL, fecha TEXT NOT NULL, razon_cierre TEXT NOT NULL, creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS ArchivoAdjunto (id TEXT PRIMARY KEY NOT NULL, id_sesion TEXT NOT NULL REFERENCES sesion(id), nombre_archivo TEXT NOT NULL, nombre_original TEXT NOT NULL, tipo_mime TEXT NOT NULL, ruta TEXT NOT NULL, creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS historialCobro (id TEXT PRIMARY KEY NOT NULL, id_usuario TEXT NOT NULL REFERENCES Usuario(id), id_sesion TEXT NOT NULL REFERENCES sesion(id), id_paciente TEXT NOT NULL REFERENCES Paciente(id), id_obra_social TEXT REFERENCES ObraSocial(id), id_metodo_pago TEXT NOT NULL REFERENCES metodoPago(id), id_servicio TEXT NOT NULL REFERENCES Servicio(id), monto INTEGER NOT NULL, fecha TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, estado TEXT NOT NULL DEFAULT 'Activo', notas TEXT, creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, actualizado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`
];

const privileges = [
  "Gestión de Agenda",
  "Historias Clínicas",
  "Historial de Cobros",
  "Gestión de Pacientes",
  "Gestión de Usuarios",
  "Gestión de Roles",
  "Configuración"
];

const administratorPrivileges = [
  "Gestión de Usuarios",
  "Gestión de Roles"
];

const speechTherapistRole = {
  name: "Fonoaudiólogo/a",
  description: "Acceso a todas las funcionalidades clínicas y operativas del sistema"
};

const speechTherapistPrivileges = privileges.filter(
  (name) => !["Gestión de Usuarios", "Gestión de Roles"].includes(name)
);

await client.batch(schema, "write");

const findOne = async (sql, args) => {
  const result = await client.execute({ sql, args });
  return result.rows[0];
};

let adminRole = await findOne("SELECT id FROM rol WHERE lower(nombre) = lower(?) LIMIT 1", ["Administrador"]);
if (!adminRole) {
  adminRole = { id: crypto.randomUUID() };
  await client.execute({
    sql: "INSERT INTO rol (id, nombre, descripcion, estado, creado_en, actualizado_en) VALUES (?, ?, ?, ?, ?, ?)",
    args: [adminRole.id, "Administrador", "Acceso completo al sistema", "Activo", now, now]
  });
}

const privilegeIdsByName = new Map();

for (const name of privileges) {
  let privilege = await findOne("SELECT id FROM privilegio WHERE lower(nombre) = lower(?) LIMIT 1", [name]);
  if (!privilege) {
    privilege = { id: crypto.randomUUID() };
    await client.execute({
      sql: "INSERT INTO privilegio (id, nombre, estado, creado_en, actualizado_en) VALUES (?, ?, ?, ?, ?)",
      args: [privilege.id, name, "Activo", now, now]
    });
  }
  privilegeIdsByName.set(name, privilege.id);
}

const administratorPrivilegeIds = administratorPrivileges.map((name) => privilegeIdsByName.get(name));
const placeholders = administratorPrivilegeIds.map(() => "?").join(", ");

await client.execute({
  sql: `DELETE FROM rol_privilegio WHERE id_rol = ? AND id_privilegio NOT IN (${placeholders})`,
  args: [adminRole.id, ...administratorPrivilegeIds]
});

for (const privilegeId of administratorPrivilegeIds) {
  await client.execute({
    sql: "INSERT OR IGNORE INTO rol_privilegio (id_rol, id_privilegio, creado_en) VALUES (?, ?, ?)",
    args: [adminRole.id, privilegeId, now]
  });
}

let speechTherapistRoleRecord = await findOne(
  "SELECT id FROM rol WHERE lower(nombre) = lower(?) LIMIT 1",
  [speechTherapistRole.name]
);

if (!speechTherapistRoleRecord) {
  speechTherapistRoleRecord = { id: crypto.randomUUID() };
  await client.execute({
    sql: "INSERT INTO rol (id, nombre, descripcion, estado, creado_en, actualizado_en) VALUES (?, ?, ?, ?, ?, ?)",
    args: [
      speechTherapistRoleRecord.id,
      speechTherapistRole.name,
      speechTherapistRole.description,
      "Activo",
      now,
      now
    ]
  });
}

const speechTherapistPrivilegeIds = speechTherapistPrivileges.map((name) => privilegeIdsByName.get(name));
const speechTherapistPlaceholders = speechTherapistPrivilegeIds.map(() => "?").join(", ");

await client.execute({
  sql: `DELETE FROM rol_privilegio WHERE id_rol = ? AND id_privilegio NOT IN (${speechTherapistPlaceholders})`,
  args: [speechTherapistRoleRecord.id, ...speechTherapistPrivilegeIds]
});

for (const privilegeId of speechTherapistPrivilegeIds) {
  await client.execute({
    sql: "INSERT OR IGNORE INTO rol_privilegio (id_rol, id_privilegio, creado_en) VALUES (?, ?, ?)",
    args: [speechTherapistRoleRecord.id, privilegeId, now]
  });
}

const normalizedEmail = hasAdminCredentials ? ADMIN_EMAIL.trim().toLowerCase() : null;
let adminUser = normalizedEmail
  ? await findOne("SELECT id FROM Usuario WHERE email = ? LIMIT 1", [normalizedEmail])
  : await findOne(
      "SELECT Usuario.id FROM Usuario INNER JOIN rol ON Usuario.id_rol = rol.id WHERE lower(rol.nombre) = lower(?) LIMIT 1",
      ["Administrador"]
    );
let created = false;
if (!adminUser) {
  if (!hasAdminCredentials) {
    throw new Error("Definí ADMIN_EMAIL y ADMIN_PASSWORD para crear el administrador inicial.");
  }
  adminUser = { id: crypto.randomUUID() };
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await client.execute({
    sql: "INSERT INTO Usuario (id, id_rol, nombre, apellido, email, contrasena, estado, creado_en, actualizado_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    args: [adminUser.id, adminRole.id, ADMIN_NAME?.trim() || "Administrador", ADMIN_LAST_NAME?.trim() || "Vitaly", normalizedEmail, passwordHash, "Activo", now, now]
  });
  created = true;
}

const dniDocumentType = await findOne(
  "SELECT id FROM TipoDocumento WHERE lower(nombre) = lower(?) LIMIT 1",
  ["DNI"]
);

if (!dniDocumentType) {
  await client.execute({
    sql: "INSERT INTO TipoDocumento (id, nombre, estado, id_usuario, creado_en, actualizado_en) VALUES (?, ?, ?, ?, ?, ?)",
    args: [crypto.randomUUID(), "DNI", "Activo", adminUser.id, now, now]
  });
}

console.log(JSON.stringify({ initialized: true, administratorCreated: created, email: normalizedEmail }));
await client.close();
