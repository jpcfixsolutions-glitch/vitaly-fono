import { StatusCell } from './StatusCell';

/**
 * Construye las columnas de la tabla de pacientes.
 *
 * Obviamos la columna de las acciones, ya que depende de cada componente que la use y los distintos botones que se muestran en la tabla.
 * 
 * @param {Object} dataPatient - Objeto que contiene los datos de todos los pacientes.
 * @returns {Array} - Array de objetos que representan las columnas de la tabla.
 */
export const buildPatientColumns = (dataPatient) => ([
  { header: "N°", accessor: "_id" },
  { header: "Nombre Completo", accessor: "full_name" },
  { header: "Tipo de Doc.", accessor: "document_type" },
  { header: "Nro de Doc.", accessor: "document_number" },
  { header: "Edad", accessor: "age" },
  { header: "Teléfono", accessor: "phone" },
  { header: "Obra Social", accessor: "health_insurance" },
  { 
    header: "Estado", 
    accessor: "status", 
    cell: (row) => <StatusCell row={row} dataPatient={dataPatient} />
  },
  { header: "Última modificación el", accessor: "updated_at" },
]);
