import React, { useState } from 'react';
import '../styles/Login.css';
import { loginAdmin } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (username.trim() === '') {
      setError('El nombre de usuario es requerido');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await loginAdmin(username, password);
      
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

  return (
    <div className="login-container">
      <h2>Acceso Administrativo - Sistema de Pasantías</h2>
      <form onSubmit={handleSubmit} className="login-form">
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
        <button onClick={() => navigate('/')} className="register-button">
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;