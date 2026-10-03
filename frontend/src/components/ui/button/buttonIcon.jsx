export const ButtonIcon = ({ id, icon, parentMethod, dataBsToggle, dataBsTarget, className = "" }) => {
  return (
    <button className={`button-icon ${className}`} onClick={parentMethod} id={id} data-bs-toggle={dataBsToggle} data-bs-target={dataBsTarget}>
      <i className={`fa-solid ${icon}`}></i>
    </button>
  );
}