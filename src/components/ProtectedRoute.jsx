import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  // Verificar si el usuario está autenticado
  const isAuth = isAuthenticated();
  
  // Verificar si el usuario es administrador (si se requiere)
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  
  // Si no está autenticado, redirigir al login
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }
  
  // Si se requiere ser admin y el usuario no lo es, redirigir
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // Si pasa todas las verificaciones, mostrar el contenido protegido
  return children;
};

export default ProtectedRoute;