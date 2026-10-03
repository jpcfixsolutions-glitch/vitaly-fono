import React from 'react';
import logoVitaly from '../../../assets/logovitaly.png';
import '../login.css';

export const LoginHeader = () => (
  <div className="login-header">
    <div className="login-logo-icon-wrapper">
      <img src={logoVitaly} alt="Vitaly" className="login-logo-icon" />
    </div>
    <h1 className="login-title">Vitaly</h1>
    <p className="login-subtitle">Ingrese sus credenciales para continuar</p>
  </div>
);