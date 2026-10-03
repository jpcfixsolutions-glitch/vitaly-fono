import boavidaLogo from '../../../assets/boavida-logo.PNG';

import './homeCard.css';

export const HomeCard = ({ userName }) => {
  return (
    <>
      <div className="home-card">
        <div className="home-card-body">
          <div className="home-card-logo">
            <img src={boavidaLogo} alt="Boavida Logo" className="logo-image" />
          </div>
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