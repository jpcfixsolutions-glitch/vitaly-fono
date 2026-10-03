// src/components/login/components/LoginForm.jsx (CORREGIDO)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../../context/useAuth';
import { Form } from '../../form';
import { Loading } from '../../ui/loading';
import { useTimedVisibility } from '../../../hooks';
import { Controller } from 'react-hook-form'; // <-- Solo importamos Controller
import '../login.css';

export const LoginForm = () => {
  const [apiError, setApiError] = useState(null);

  // 1. Obtenemos 'isLoading' (que ahora es 'isActionLoading')
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const { visible: errorVisible } = useTimedVisibility({
    trigger: apiError,
    durationMs: 2250,
    showWhen: true
  });

  // 2. No necesitamos 'useForm' aquí. Tu <Form> global se encarga.

  const onSubmit = async (formData) => {
    setApiError(null);
    const { email, password } = formData;
    const result = await login(email, password); // Llama al login del context

    if (result.success) {
      navigate('/');
    } else {
      setApiError(new Error(result.error));
    }
  };

  return (
    <Form
      formId="loginForm"
      onSubmit={onSubmit} // <-- 3. Pasamos tu 'onSubmit'
      loading={false} // Bypasseamos el loader global
      error={null}    // Bypasseamos el error global
      className="login-form"
    // 4. Tu <Form> global nos da el 'control' y 'errors'
    >
      {({ control, errors }) => (
        <>
          {/* Email Input */}
          <div className="login-input-group">
            <label htmlFor="email" className="login-label">Email</label>
            <div className="login-input-wrapper">
              <div className="login-input-icon">
                <Mail size={20} />
              </div>
              <Controller
                name="email"
                control={control} // <-- Usamos el control del <Form>
                rules={{
                  required: "El email es requerido.",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email inválido" }
                }}
                render={({ field }) => (
                  <input
                    id="email"
                    type="email"
                    {...field}
                    className={`login-input ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Ingrese su email"
                    required
                    autoComplete="off"
                  />
                )}
              />
            </div>
            {errors.email && <span className="login-form-error">{errors.email.message}</span>}
          </div>

          {/* Password Input */}
          <div className="login-input-group">
            <label htmlFor="password" className="login-label">Contraseña</label>
            <div className="login-input-wrapper">
              <div className="login-input-icon">
                <Lock size={20} />
              </div>
              <Controller
                name="password"
                control={control} // <-- Usamos el control del <Form>
                rules={{ required: "La contraseña es requerida." }}
                render={({ field }) => (
                  <input
                    id="password"
                    type="password"
                    {...field}
                    className={`login-input ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Ingrese su contraseña"
                    required
                    autoComplete="off"
                  />
                )}
              />
            </div>
            {errors.password && <span className="login-form-error">{errors.password.message}</span>}
          </div>

          {/* Contenedor de Feedback (Loader/Error) */}
          {(isLoading || errorVisible) && (
            <div className="login-feedback-container">
              {isLoading && (
                <Loading className="loading-container-form" />
              )}
              {errorVisible && apiError && !isLoading && (
                <div className="login-api-error">
                  {apiError.message}
                </div>
              )}
            </div>
          )}

          <button type="submit" className="login-button" disabled={isLoading}>
            Iniciar Sesión
          </button>
        </>
      )}
    </Form>
  );
};