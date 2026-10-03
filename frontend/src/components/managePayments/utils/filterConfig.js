import { getTodayDate } from "./date";

export const paymentFilterConfig = [
  {
    id: 'searchPatient',
    label: 'Buscar paciente',
    type: 'text',
    icon: 'fa-user',
    placeholder: 'Nombre y Apellido...',
    defaultValue: ''
  },
  {
    id: 'startDate',
    label: 'Fecha inicio',
    type: 'date',
    icon: 'fa-calendar',
    defaultValue: getTodayDate()
  },
  {
    id: 'endDate',
    label: 'Fecha final',
    type: 'date',
    icon: 'fa-calendar',
    defaultValue: ''
  }
];


