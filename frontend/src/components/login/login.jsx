import React from 'react';
import { LoginDecorations } from './components/LoginDecorations';
import { LoginHeader } from './components/LoginHeader';
import { LoginForm } from './components/LoginForm';
import './login.css';

export const Login = () => {
  return (
    <div className="login-screen">
      <LoginDecorations />

      <div className="login-container">
        <div className="login-card">
          <LoginHeader />
          <LoginForm />
        </div>

        <div className="login-indicator-dots">
          <div className="login-dot dot-1"></div>
          <div className="login-dot dot-2"></div>
          <div className="login-dot dot-3"></div>
        </div>
      </div>
    </div>
  );
};