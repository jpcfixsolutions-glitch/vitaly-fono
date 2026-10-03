import { AlertCircle } from "lucide-react";
import { ViewDataHeaderSection } from "../../viewData/components/ViewDataHeaderSection.jsx";

/**
 * Renderizador de estado especial para error de rango de fechas en pagos.
 * Devuelve el fragmento a mostrar en ViewData cuando la fecha es inválida.
 */
export const renderDateErrorState = ({ apiLoading, dateError, modalId = "formAddPayment" }) => {
  if (!dateError || apiLoading) return undefined;

  return (
    <>
      <ViewDataHeaderSection
        title="Historial de Cobros"
        buttonLabel="Registrar cobro"
        buttonDataBsTarget={`#${modalId}`}
        buttonClassName="btn-new-payment"
        className="header-for-error"
      />
      <div className="table-content">
        <div className="no-data-message">
          <AlertCircle size={24} />
          <p>Por favor, corrige el rango de fechas para ver los registros</p>
        </div>
      </div>
    </>
  );
};

