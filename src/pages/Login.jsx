import React, { useState } from 'react';
import '../styles/Login.css';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [legajo, setLegajo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLegajoChange = (e) => {
    const value = e.target.value;
    // Solo permitir números y mantener el foco
    if (/^\d*$/.test(value)) {
      setLegajo(value);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (legajo.length < 4 || legajo.length > 6) {
      setError('El legajo debe tener entre 4 y 6 dígitos');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await loginUser(legajo, password);
      
      if (result.success) {
        // Guardar información del usuario en sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(result.user));
        sessionStorage.setItem('isAdmin', result.isAdmin);
        
        alert('Inicio de sesión exitoso');
        // Aquí podrías redirigir al usuario a su dashboard o página principal
      } else {
        setError(result.message || 'Credenciales inválidas');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const redirectToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <h2>Inicio de Sesión - Sistema de Pasantías</h2>
      <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
            <label htmlFor="legajo">Legajo:</label>
            <input
              type="number"
              id="legajo"
              name="legajo"
              value={legajo}
              onChange={handleLegajoChange}
              placeholder="Ingrese su número de legajo"
              required
              disabled={loading}
            />
          </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Ingrese su contraseña"
            minLength={6}
            required
            disabled={loading}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Procesando...' : 'Iniciar Sesión'}
        </button>
      </form>
      <div className="register-section">
          <p>¿No estás registrado?</p>
          <button onClick={redirectToRegister} className="register-button" disabled={loading}>
            Registrarse con SAU
          </button>
        </div>
    </div>
  );
};

export default Login;