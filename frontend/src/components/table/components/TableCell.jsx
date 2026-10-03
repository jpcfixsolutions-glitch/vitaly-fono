import React from 'react';
import { formatCurrency } from '../../managePayments/utils/format';
import { format } from 'date-fns';

/**
 * TableCell
 * Componente encargado de renderizar una celda individual dentro de una fila de tabla.
 * El renderizado de la celda depende de la configuración y nombre del accessor de la columna, permitiendo displays personalizados.
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.col - Definición de la columna actual, contiene accessor y opcionalmente una función cell personalizada.
 * @param {Object} props.row - Objeto de datos correspondientes a la fila actual.
 * @param {number} props.index - Índice de la fila actual (para numeración cuando aplica).
 * @returns {JSX.Element} Celda de tabla renderizada de acuerdo a la lógica especificada.
 *
 * Detalles de la lógica en cada paso:
 * 1. Si la columna tiene una función personalizada (col.cell), la usa para renderizar la celda, pasando toda la fila (row).
 * 2. Obtiene el accessor como string y saca el valor específico de esa celda de la fila.
 * 3. Si el accessor incluye "_id", muestra el número de fila (index+1), útil para listas numeradas.
 * 4. Si el accessor incluye "price", interpreta el valor como número y lo muestra con formato de precio en pesos.
 *    Si el valor es 0, lo muestra explícitamente como "$ 0".
 * 5. Si el accessor incluye "age", chequea si es un string con guion ("-") y en ese caso muestra "Sin datos".
 *    Si hay un valor válido, lo muestra.
 * 6. Si el accessor incluye "privileges", espera un array; si tiene elementos, los muestra como string separados por coma.
 *    Si no, muestra "Sin privilegios".
 * 7. En cualquier otro caso, intenta mostrar el valor si existe, o bien "Sin datos" en gris si está vacío, nulo o indefinido.
 */
export const TableCell = ({ col, row, index }) => {
  // 1. Si la columna define una función personalizada "cell", usarla para renderizar la celda.
  if (col.cell) {
    return <div>{col.cell(row)}</div>;
  }

  // 2. Obtener el accessor y el valor correspondiente de la fila
  const accessor = String(col.accessor);
  const value = row[col.accessor];

  // 3. Si el accessor incluye "_id", renderizar el número de fila (index+1)
  if (accessor.includes("_id")) {
    return <div>{index + 1}</div>;
  }

  // 4. Si el accessor incluye "price", mostrar el valor formateado como precio en pesos
  if (accessor.includes("price") || accessor.includes("amount")) {
    const numValue = Number(value);
    return <div>{numValue === 0 ? "$ 0" : formatCurrency(numValue)}</div>;
  }

  // 5. Si el accessor incluye "age", tratar casos especiales para valores vacíos o inválidos
  if (accessor.includes("age")) {
    // Si el valor contiene un guion ("-"), se asume que no hay datos válidos ("Sin datos")

    return (
      <div>
        {value && String(value).includes("-") ? (
          <span className="text-muted">Sin datos</span>
        ) : (
          <span>{value}</span>
        )}
      </div>
    );
  }

  // 6. Si el accessor incluye "privileges", mostrar una lista o "Sin privilegios" si está vacío o no es un array
  if (accessor.includes("privileges")) {
    if (Array.isArray(value) && value.length > 0) {
      return (
        <div className="d-flex flex-column flex-wrap gap-2">
          <span>{value.join(', ')}</span>
        </div>
      );
    }
    return (
      <div>
        <span className="text-muted">Sin privilegios</span>
      </div>
    );
  }

  
  if (accessor.includes("last_login")) {
    return (
      <div>
        <span>{`${format(value, 'dd/MM/yyyy')} - ${format(value, 'HH:mm')} hs`}</span>
      </div>
    );
  }

  if (accessor.includes("created_at")) {
    return (
      <div>
        <span>{`${format(value, 'dd/MM/yyyy')} - ${format(value, 'HH:mm')} hs`}</span>
      </div>
    );
  }
  
  if (accessor.includes("updated_at")) {
    return (
      <div>
        <span>{`${format(value, 'dd/MM/yyyy')} - ${format(value, 'HH:mm')} hs`}</span>
      </div>
    );
  }

  // 7. Renderizado por default: si hay valor lo muestra, si no muestra "Sin datos"
  return (
    <div>
      {value ? <span>{value}</span> : <span className="text-muted">Sin datos</span>}
    </div>
  );
};
