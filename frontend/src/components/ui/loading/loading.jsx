import './loading.css';

export const Loading = ({ className }) => {
  return (
    <div className={`${className}`}>
      <img src="/assets/tube-spinner.svg" alt="Cargando..." />
    </div>
  )
}