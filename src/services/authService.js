const API_URL = 'https://backenddsi.onrender.com';

// Función para iniciar sesión
export const loginUser = async (legajo, password) => {
  try {
    // Primero obtenemos todos los usuarios para verificar las credenciales
    const response = await fetch(`${API_URL}/users`);
    
    if (!response.ok) {
      throw new Error('Error al conectar con el servidor');
    }
    
    const users = await response.json();
    
    // Buscar el usuario con las credenciales proporcionadas
    const user = users.find(
      u => u.legajo === legajo && u.password === password
    );
    
    if (user) {
      return { success: true, user };
    } else {
      return { success: false, message: 'Legajo o contraseña incorrectos' };
    }
  } catch (error) {
    console.error('Error en el login:', error);
    return { success: false, message: 'Error de conexión con el servidor' };
  }
};

