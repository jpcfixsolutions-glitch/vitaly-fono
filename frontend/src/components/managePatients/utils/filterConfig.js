/**
 * Configuración de los filtros para la búsqueda de pacientes.
 * 
 * Cada objeto de configuración representa un filtro y puede tener las siguientes propiedades:
 * 
 * @typedef {Object} FilterConfig
 * @property {string} id - Identificador único del filtro (usado como key y para mapear con los datos).
 * @property {string} label - El texto que se muestra al usuario como nombre del filtro.
 * @property {string} type - El tipo de filtro. Puede ser 'text', 'select', etc. Determina el tipo de input que se renderiza.
 * @property {string} [icon] - (Opcional) Nombre de la clase de icono FontAwesome; se muestra junto al label.
 * @property {string} [placeholder] - (Opcional, solo para filtros tipo 'text') El texto placeholder del campo de entrada.
 * @property {any} [defaultValue] - Valor por defecto para el filtro (por ejemplo '' o undefined).
 * @property {Array<{value: string, label: string}>} [options] - (Solo para tipo 'select') Lista de opciones del select, cada una con un valor y una etiqueta para mostrar.
 */

/** @type {FilterConfig[]} */
export const patientFilterConfig = [
  {
    id: 'fullName',
    label: 'Nombre y/o apellido',
    type: 'text',
    icon: 'fa-user',
    placeholder: 'Ej: María González',
    defaultValue: ''
  },
  {
    id: 'status',
    label: 'Estado',
    type: 'select',
    icon: 'fa-circle-check',
    options: [
      { value: '', label: 'Todos los estados' },
      { value: 'active', label: 'Activo' },
      { value: 'inactive', label: 'Inactivo' }
    ],
    defaultValue: ''
  }
];