import { useSearchFilters } from './hooks/useSearchFilters';
import { FiltersHeader } from './components/FiltersHeader';
import { renderFilterInput } from './components/renderFilterInput';

import './searchFilters.css';

export const SearchFilters = ({
  filters = [],
  onFilterChange,
}) => {
  // Hook para manejar los valores de los filtros y los handlers para cambiar los valores de los filtros y limpiar los filtros
  const { filterValues, handleFilterChange, handleClearFilters } = useSearchFilters(filters, onFilterChange);

  return (
    <div className="filters-section">
      <FiltersHeader />

      <div className="filters-content">
        {/* Renderizamos los distintos filtros que vienen en filters que se carga en el componente padre a través del filterConfig del componente padre. */}
        {filters.map(filter => (
          <div key={filter.id} className="filter-item">
            <label className="filter-label">
              {filter.icon && (
                <i className={`fa ${filter.icon}`}></i>
              )}
              {filter.label}
            </label>
            {renderFilterInput(filter, filterValues, handleFilterChange)}
          </div>
        ))}

        <button
          onClick={handleClearFilters}
          className="btn-clear-filters"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

