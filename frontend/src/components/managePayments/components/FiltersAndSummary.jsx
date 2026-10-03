import { SearchFilters } from "../../layout/searchFilters";
import { formatCurrency } from "../utils/format";
import { DateErrorNotice } from "./DateErrorNotice";

export const FiltersAndSummary = ({
  filterConfig,
  onFilterChange,
  dateError,
  totalAmount,
}) => (
  <div className="funcionality-container-functions">
    <div style={{ flex: 1, minWidth: "300px" }}>
      <SearchFilters filters={filterConfig} onFilterChange={onFilterChange} />
      {dateError && <DateErrorNotice />}
    </div>

    <div className="summary-section">
      <h3 className="summary-title">Resumen del Período</h3>
      <div className="summary-content">
        <p className="summary-label">Total de Cobros</p>
        <p className="summary-amount">{formatCurrency(totalAmount)}</p>
      </div>
    </div>
  </div>
);


