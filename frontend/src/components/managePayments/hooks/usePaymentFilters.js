import { useCallback, useMemo, useState } from "react";
import { paymentFilterConfig } from "../utils/filterConfig";
import { parseDate } from "../utils/date";

// Esta función crea un objeto con los valores por defecto para cada filtro de la configuración de filtros de pago.
// Recorre el array paymentFilterConfig, y para cada filtro toma su id como clave y su defaultValue como valor (o "" si no tiene defaultValue).
const defaultPaymentFilters = paymentFilterConfig.reduce((acc, filter) => {
  acc[filter.id] = filter.defaultValue ?? "";
  return acc;
}, {});

export const usePaymentFilters = (payments) => {
  const [filters, setFilters] = useState(defaultPaymentFilters);

  const handleFilterChange = useCallback((updatedFilters) => {
    setFilters((prev) => ({ ...prev, ...updatedFilters }));
  }, []);

  const { filteredPayments, dateError, totalAmount } = useMemo(() => {
    const startDate = parseDate(filters.startDate);
    const endDate = parseDate(filters.endDate);
    const hasDateError = !!(startDate && endDate && startDate > endDate);

    const baseList = Array.isArray(payments) ? payments : [];
    if (hasDateError) {
      return { filteredPayments: [], dateError: true, totalAmount: 0 };
    }

    const filteredList = baseList.filter((payment) => {
      const paymentDate = parseDate(payment.fecha);

      if (startDate) {
        if (!paymentDate || paymentDate < startDate) return false;
      }

      if (endDate) {
        if (!paymentDate || paymentDate > endDate) return false;
      }

      if ((filters.searchPatient || "").trim() !== "") {
        const searchTerm = filters.searchPatient.toLowerCase().trim();
        const fullName = `${payment.nombre} ${payment.apellido}`.toLowerCase();
        if (!fullName.includes(searchTerm)) return false;
      }

      return true;
    });

    const totalPaid = filteredList
      .filter((p) => String(p.status || "").toLowerCase() === "pagada")
      .reduce((sum, p) => sum + (Number(p.amount ?? p.monto) || 0), 0);

    return {
      filteredPayments: filteredList,
      dateError: false,
      totalAmount: totalPaid
    };
  }, [filters, payments]);

  return {
    filters,
    filteredPayments,
    dateError,
    totalAmount,
    handleFilterChange
  };
};


