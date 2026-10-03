import React from 'react';

/**
/**
 * Componente TableHeader que renderiza el encabezado de una tabla.
 * Utiliza el método columns.map para iterar sobre el array de definición de columnas,
 * generando un elemento <th> para cada columna usando la propiedad "header" (texto que se mostrará como encabezado)
 * y usando "accessor" como clave única para cada <th>.
 * Si hideActions es false, además agrega una columna "Acciones" al final del encabezado.
 *
 * @component
 * @param {Object} props
 * @param {Array} props.columns - Definición de columnas de la tabla.
 * @param {boolean} [props.hideActions=false] - Oculta la columna de acciones si es true.
 * @returns {JSX.Element}
 */
export const TableHeader = ({ columns, hideActions }) => {
  return (
    <thead className="table-head">
      <tr>
        {columns.map((col) => (
          <th key={String(col.accessor)}>{col.header}</th>
        ))}
        {!hideActions && <th>Acciones</th>}
      </tr>
    </thead>
  );
};

