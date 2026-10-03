import { useState, useEffect } from "react";
import { DollarSign } from "lucide-react";
import { Section, ModalPost, Container, ViewData, ModalDelete } from "..";
import { ModalGet } from "../modal/modalGet.jsx";
import { ViewPaymentDetail } from "./components/viewPaymentDetail.jsx";
import { FormPayment, FiltersAndSummary, renderDateErrorState } from "./components";
import "./managePayments.css";
import { paymentFilterConfig } from "./utils/filterConfig";
import { usePaymentFilters } from "./hooks/usePaymentFilters";
import { RowActions } from "./components/RowActions.jsx";
import { usePaymentSubmitPost } from "./hooks/usePaymentSubmitPost.js";
import { usePaymentGets } from "./hooks/usePaymentGets.js";
import { formatHealthInsuranceOptions, formatPatientsById, formatPaymentMethodOptions, formatServiceOptions, formatSessionOptions, formatPaymentsForFilters } from "./utils/format.js";
import { usePaymentSubmitDeactivate } from "./hooks/usePaymentSubmitDeactivate.js";

const columns = [
  { header: "N°", accessor: "_id" },
  { header: "Fecha y Hora", accessor: "paid_at" },
  { header: "Nombre", accessor: "name" },
  { header: "Apellido", accessor: "last_name" },
  { header: "Obra Social", accessor: "health_insurance_name" },
  {
    header: "Estado",
    accessor: "status",
    cell: (row) => {
      const s = String(row.status || "").toLowerCase();
      const cls = s === "pagada" ? "status-active" : s === "anulado" ? "status-inactive" : "";
      const label = s === "pagada" ? "Cobrado" : (row.status || "Sin datos");
      return <span className={`status-badge ${cls}`}>{label}</span>;
    }
  },
  { header: "Método de Pago", accessor: "payment_method_name" },
  { header: "Servicio", accessor: "service_name" },
  { header: "Monto", accessor: "amount" }
];

export const ManagePayments = () => {
  // Estado para almacenar los pagos
  const [payments, setPayments] = useState([]);
  
  // Estado para almacenar el pago seleccionado para ver el detalle
  const [viewPayment, setViewPayment] = useState(null);

  // Estado para almacenar los datos del pago a desactivar
  const [dataDeactivate, setDataDeactivate] = useState(null);

  // Hook para manejar los filtros y los datos filtrados
  const { filteredPayments, handleFilterChange, dateError, totalAmount } = usePaymentFilters(payments);

  // Hook para manejar la obtención de catálogos utilizados en la gestión de pagos
  const { 
    payments: paymentsGet,
    loadingPaymentHistory,
    errorPaymentHistory,
    sessions: sessionsGet,
    apiLoadingGetSessions,
    apiErrorGetSessions,
    patients: patientsGet,
    apiLoadingGetPatients,
    apiErrorGetPatients,
    services: servicesGet,
    apiLoadingGetServices,
    apiErrorGetServices,
    healthIns: healthInsGet,
    apiLoadingGetHealthIns,
    apiErrorGetHealthIns,
    paymentMethods: paymentMethodsGet,
    apiLoadingGetPaymentMethods,
    apiErrorGetPaymentMethods 
  } = usePaymentGets();

  // Derivados para formulario. Ponemos en una sola variable para no repetir el código.
  const loadingCatalogs = apiLoadingGetSessions || apiLoadingGetPatients || apiLoadingGetServices || apiLoadingGetHealthIns || apiLoadingGetPaymentMethods;
  const errorCatalogs = apiErrorGetSessions || apiErrorGetPatients || apiErrorGetServices || apiErrorGetHealthIns || apiErrorGetPaymentMethods;
  const errorCatalogsMessage =
    apiErrorGetSessions?.message ||
    apiErrorGetPatients?.message ||
    apiErrorGetServices?.message ||
    apiErrorGetHealthIns?.message ||
    apiErrorGetPaymentMethods?.message ||
    null;

  // Formateo de catálogos para el formulario, para que los selects tengan las opciones bien mostradas.
  const patientById = formatPatientsById(patientsGet);
  const healthInsuranceOptions = formatHealthInsuranceOptions(healthInsGet);
  const paymentMethodOptions = formatPaymentMethodOptions(paymentMethodsGet);
  const serviceOptions = formatServiceOptions(servicesGet);
  const sessionOptions = formatSessionOptions(sessionsGet, patientById);

  // Hook para manejar el submit del formulario.
  const { 
    successMessage,
    errorMessage,
    apiLoadingPostPayment, 
    apiErrorPostPayment,
    onSubmitPayment
  } = usePaymentSubmitPost();

  // Hook para manejar el desactivar de un registro de historial de cobro
  const {
    successMessage: successDeactivatePaymentHistory,
    errorMessage: errorMessageDeactivatePaymentHistory,
    isLoading: isLoadingDeactivatePaymentHistory,
    apiLoadingDeactivatePaymentHistory,
    apiErrorDeactivatePaymentHistory: apiErrorDeactivatePaymentHistory,
    onSubmitDeactivatePaymentHistory: onSubmitDeactivatePaymentHistory
  } = usePaymentSubmitDeactivate(dataDeactivate);

  // Normalizamos los pagos para que los filtros funcionen (fecha en YYYY-MM-DD, nombres, etc.)
  useEffect(() => {
    const formattedPayments = formatPaymentsForFilters(paymentsGet);
    setPayments(formattedPayments);
  }, [paymentsGet]);

  return (
    <>
      <Container>
        <Section
          Icon={DollarSign}
          title="Gestión de Cobros"
          description="Lleva el control de tus ingresos y registra los pagos recibidos por sesión">

          <FiltersAndSummary
            filterConfig={paymentFilterConfig}
            onFilterChange={handleFilterChange}
            dateError={dateError}
            totalAmount={totalAmount}
          />

          <ViewData
            data={{ data: filteredPayments }}
            apiLoading={loadingPaymentHistory}
            apiError={errorPaymentHistory}
            message={errorPaymentHistory ? "No se encontraron registros para el período seleccionado" : "No se encontraron registros de cobros para esos filtros."}
            columns={columns}
            title="Historial de Cobros"
            buttonLabel="Registrar cobro"
            buttonDataBsTarget="#formAddPayment"
            buttonClassName="btn-new-payment"
            classNameEspecificTable="table-payments"
            dataBsTargetView="#viewPaymentModal"
            renderRowActions={(row) => (
              <RowActions
                row={row}
                filteredPayments={filteredPayments}
                setViewPayment={setViewPayment}
                setDataDeactivate={setDataDeactivate}
                isAnulado={String(row.status || "").toLowerCase() === "anulado"}
              />
            )}
            stateRenderer={({ apiLoading }) =>
              renderDateErrorState({ apiLoading, dateError, modalId: "formAddPayment" })
            }
          />
        </Section>

        <ModalPost 
          id="formAddPayment" 
          title="Registrar nuevo cobro" 
          formId="formAddPaymentForm" 
          loading={apiLoadingPostPayment}>

          <FormPayment
            idModal="formAddPayment"
            formId="formAddPaymentForm"
            onSubmit={onSubmitPayment}
            loading={apiLoadingPostPayment || loadingCatalogs}
            error={apiErrorPostPayment || errorCatalogs}
            errorMessage={errorMessage || errorCatalogsMessage}
            successMessage={successMessage}
            sessionOptions={sessionOptions}
            healthInsuranceOptions={healthInsuranceOptions}
            paymentMethodOptions={paymentMethodOptions}
            serviceOptions={serviceOptions}
            initialValues={undefined}
          />

        </ModalPost>

        <ModalDelete
          id="deactivatePaymentHistoryModal"
          title="Anular registro de cobro"
          formId="deactivatePaymentHistoryForm"
          loading={isLoadingDeactivatePaymentHistory}
          buttonLabel="Anular"
          buttonLoadingLabel="Anulando..."
        >
          <FormPayment
            idModal="deactivatePaymentHistoryModal"
            formId="deactivatePaymentHistoryForm"
            onSubmit={onSubmitDeactivatePaymentHistory}
            loading={apiLoadingDeactivatePaymentHistory || isLoadingDeactivatePaymentHistory}
            error={apiErrorDeactivatePaymentHistory}
            errorMessage={errorMessageDeactivatePaymentHistory}
            successMessage={successDeactivatePaymentHistory}
            mode="delete"
            initialValues={dataDeactivate || {}}
          />
        </ModalDelete>

        <ModalGet id="viewPaymentModal" title="Detalle del Cobro">
          <ViewPaymentDetail payment={viewPayment} />
        </ModalGet>
      </Container>
    </>
  );
};