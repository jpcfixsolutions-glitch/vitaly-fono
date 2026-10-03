import './button.css'
import { CircleArrowUp } from "lucide-react";

/**
 * Componente para crear un botón.
 * @param {string} label - El label del botón.
 * @param {function} parentMethod - El método que se ejecutará cuando se haga click en el botón.
 * @param {string} dataBsToggle - El data-bs-toggle del botón. Es un atributo de bootstrap para abrir un modal. Asociamos la modal al botón.
 * @param {string} dataBsTarget - El data-bs-target del botón. Es un atributo de bootstrap para abrir un modal. Asociamos la modal al botón.
 * @returns 
 */
export const Button = ({ label, parentMethod, dataBsToggle = null, dataBsTarget = null, className = "" }) => {
  return (
    <button className={`button ${className}`} onClick={parentMethod} data-bs-toggle={dataBsToggle} data-bs-target={dataBsTarget}>{label}</button>
  );
}