import './homeCard.css';

export const HomeCard = ({ userName }) => {
  return (
    <>
      <div className="home-card">
        <div className="home-card-body">
          <div>
            <h3 className="home-card-title">¡Bienvenid@ {userName} a Vitaly!</h3>
            <p className="home-card-text">
              Bienvenido/a al panel de gestión de la aplicación. Desde aquí podrás acceder y administrar todas las funciones y herramientas disponibles, de manera simple y organizada.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
