import { StatusCell } from '.';

/**
 * Construye las columnas de la tabla de usuarios. Omitimos la columna de las acciones, ya que depende de cada componente que la use y los distintos botones que se muestran en la tabla. StatusCell es un componente que muestra el estado del usuario ("Activo" o "Inactivo") con estilos visuales.
 *
 * @param {Object} dataUser - Objeto con la información de los usuarios.
 * @returns {Array} Array de objetos con las configuraciones de las columnas.
 */
export const buildUserColumns = (dataUser) => ([
  { header: "N°", accessor: "_id" },
  { header: "Nombre", accessor: "name" },
  { header: "Apellido", accessor: "last_name" },
  { header: "Email", accessor: "email" },
  { header: "Rol", accessor: "role" },
  { 
    header: "Estado", 
    accessor: "status", 
    cell: (row) => <StatusCell row={row} dataUser={dataUser} />
  },
  // { header: "Último acceso", accessor: "last_login" }, // ToDo: esta fecha no se estaría actualizando cuando el usuario inicia sesión, deberíamos controlar esto para más adelante.
  { header: "Última modificación el", accessor: "updated_at" },
]);

