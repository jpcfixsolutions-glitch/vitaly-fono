export const buildRoleColumns = () => ([
  { header: "N°", accessor: "_id" },
  { header: "Nombre", accessor: "name" },
  { header: "Descripción", accessor: "description" },
  { header: "Privilegios", accessor: "privileges" },
]);
