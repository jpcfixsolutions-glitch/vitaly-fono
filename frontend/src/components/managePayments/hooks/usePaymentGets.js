import { useState, useEffect } from 'react';
import { useGetSession } from '../../../hooks/useGetSession';
import { usePatientGet } from './usePatientGet';
import { useServiceGet } from './useServiceGet';
import { useHealthInsuranceGet } from './useHealthInsuranceGet';
import { useGetAllPaymentMethod } from '../../../hooks/useGetAllPaymentMethod';
import { usePaymentGet } from './usePaymentGet';

/**
 * usePaymentGets
 * 
 * Custom hook que centraliza la obtención y manejo del estado para catálogos utilizados en la gestión de pagos.
 * Usado para consultar y disponibilizar localmente las sesiones, pacientes, servicios, obras sociales y métodos de pago, 
 * normalizando el acceso a estos recursos desde componentes de frontend.
 * 
 * Hooks utilizados:
 * - `useSessionGet`: obtiene las sesiones del backend y maneja su estado, loading y error.
 * - `usePatientGet`: obtiene la lista de pacientes, con gestión de estado, loading y error.
 * - `useServiceGet`: consulta los servicios disponibles.
 * - `useHealthInsuranceGet`: para consultar las obras sociales.
 * - `usePaymentMethodGet`: obtiene los métodos de pago habilitados.
 * 
 * También utiliza `useState` y `useEffect` para manejar y mantener las listas locales sincronizadas con las respuestas de los diferentes hooks de consulta.
 * 
 * Retorna:
 * - sessions: array de sesiones.
 * - patients: array de pacientes.
 * - services: array de servicios.
 * - healthIns: array de obras sociales.
 * - paymentMethods: array de métodos de pago.
 * - apiLoadingGetSessions, apiErrorGetSessions: loading y error de sesiones.
 * - apiLoadingGetPatients, apiErrorGetPatients: loading y error de pacientes.
 * - apiLoadingGetServices, apiErrorGetServices: loading y error de servicios.
 * - apiLoadingGetHealthIns, apiErrorGetHealthIns: loading y error de obras sociales.
 * - apiLoadingGetPaymentMethods, apiErrorGetPaymentMethods: loading y error de métodos de pago.
 */
export const usePaymentGets = () => {

  const [payments, setPayments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [healthIns, setHealthIns] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const { 
    dataGet: paymentsData, 
    loading: loadingPaymentHistory, 
    error: errorPaymentHistory 
  } = usePaymentGet({ 
    url: "/historial-cobro", 
    method: "GET", 
    autoFetch: true
  });

  // Utiliza el hook personalizado para obtener sesiones desde la API
  const { 
    sessions: dataSessions, 
    loading: apiLoadingGetSessions, 
    error: apiErrorGetSessions 
  } = useGetSession({
    url: "/sesion",
    method: "GET",
    autoFetch: true
  });

  const { 
    patients: dataPatients, 
    loading: apiLoadingGetPatients, 
    error: apiErrorGetPatients 
  } = usePatientGet({ 
    url: "/pacientes", 
    method: "GET", 
    autoFetch: true
  });

  const { 
    services: dataServices, 
    loading: apiLoadingGetServices, 
    error: apiErrorGetServices 
  } = useServiceGet({ 
    url: "/tipo-servicio", 
    method: "GET", 
    autoFetch: true
  });

  const { 
    healthIns: dataHealthIns, 
    loading: apiLoadingGetHealthIns, 
    error: apiErrorGetHealthIns 
  } = useHealthInsuranceGet({ 
    url: "/obras-sociales", 
    method: "GET", 
    autoFetch: true
  });

  const { 
    paymentMethods: dataPaymentMethods, 
    loading: apiLoadingGetPaymentMethods, 
    error: apiErrorGetPaymentMethods 
  } = useGetAllPaymentMethod({ 
    url: "/metodo-pago", 
    method: "GET", 
    autoFetch: true
  });

  /**
   * Efecto que actualiza el estado local de sesiones, pacientes, servicios, obras sociales y métodos de pago cada vez que los datos de sesiones, pacientes, servicios, obras sociales y métodos de pago (provenientes del backend) cambian.
   * Esto asegura que el estado de sesiones, pacientes, servicios, obras sociales y métodos de pago siempre refleje la información más reciente de la base de datos.
   */
  useEffect(() => {
    if (paymentsData && Array.isArray(paymentsData.data)) {
      setPayments(paymentsData.data);
    }

    if (dataSessions && Array.isArray(dataSessions.data)) {
      setSessions(dataSessions.data);
    }
  
    if (dataPatients && Array.isArray(dataPatients.data)) {
      setPatients(dataPatients.data);
    }

    if (dataServices && Array.isArray(dataServices.data)) {
      setServices(dataServices.data);
    }

    if (dataHealthIns && Array.isArray(dataHealthIns.data)) {
      setHealthIns(dataHealthIns.data);
    }

    if (dataPaymentMethods && Array.isArray(dataPaymentMethods.data)) {
      setPaymentMethods(dataPaymentMethods.data);
    }
  }, [paymentsData, dataSessions, dataPatients, dataServices, dataHealthIns, dataPaymentMethods]);
  

  return {
    payments,
    sessions,
    patients,
    services,
    healthIns,
    paymentMethods,
    loadingPaymentHistory,
    apiLoadingGetSessions,
    apiLoadingGetPatients,
    apiLoadingGetServices,
    apiLoadingGetHealthIns,
    apiLoadingGetPaymentMethods,
    errorPaymentHistory,
    apiErrorGetSessions,
    apiErrorGetPatients,
    apiErrorGetServices,
    apiErrorGetHealthIns,
    apiErrorGetPaymentMethods
  };
};
