import React, { useState } from 'react';
import '../styles/Login.css';
import { loginUser, loginAdmin } from '../services/authService';

const Login = () => {
  const [loginType, setLoginType] = useState('user'); // 'user' o 'admin'
  const [legajo, setLegajo] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLegajoChange = (e) => {
    const value = e.target.value;
    // Solo permitir números y mantener el foco
    if (/^\d*$/.test(value)) {
      setLegajo(value);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loginType === 'user') {
      if (legajo.length < 4 || legajo.length > 6) {
        setError('El legajo debe tener entre 4 y 6 dígitos');
        return;
      }
    } else {
      if (username.trim() === '') {
        setError('El nombre de usuario es requerido');
        return;
      }
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let result;
      
      if (loginType === 'user') {
        result = await loginUser(legajo, password);
      } else {
        result = await loginAdmin(username, password);
      }
      
      if (result.success) {
        // Guardar información del usuario en sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(result.user));
        sessionStorage.setItem('isAdmin', result.isAdmin);
        
        alert('Inicio de sesión exitoso');
        // Aquí podrías redirigir al usuario a su dashboard o página principal
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const redirectToRegister = () => {
    window.location.href = '/register';
  };

  const toggleLoginType = () => {
    setLoginType(loginType === 'user' ? 'admin' : 'user');
    setError('');
  };

  return (
    <div className="login-container">
      <h2>Inicio de Sesión - Sistema de Pasantías</h2>
      <div className="login-type-toggle">
        <button 
          className={`toggle-button ${loginType === 'user' ? 'active' : ''}`} 
          onClick={() => setLoginType('user')}
        >
          Usuario
        </button>
        <button 
          className={`toggle-button ${loginType === 'admin' ? 'active' : ''}`} 
          onClick={() => setLoginType('admin')}
        >
          Administrador
        </button>
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        {loginType === 'user' ? (
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
        ) : (
          <div className="form-group">
            <label htmlFor="username">Nombre de Usuario:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Ingrese su nombre de usuario"
              required
              disabled={loading}
            />
          </div>
        )}
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
      {loginType === 'user' && (
        <div className="register-section">
          <p>¿No estás registrado?</p>
          <button onClick={redirectToRegister} className="register-button" disabled={loading}>
            Registrarse con SAU
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;