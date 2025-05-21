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
      return { success: true, user, isAdmin: false };
    } else {
      return { success: false, message: 'Legajo o contraseña incorrectos' };
    }
  } catch (error) {
    console.error('Error en el login:', error);
    return { success: false, message: 'Error de conexión con el servidor' };
  }
};

// Función para iniciar sesión como administrador
export const loginAdmin = async (username, password) => {
  try {
    // Obtenemos todos los administradores para verificar las credenciales
    const response = await fetch(`${API_URL}/admins`);
    
    if (!response.ok) {
      throw new Error('Error al conectar con el servidor');
    }
    
    const admins = await response.json();
    
    // Buscar el administrador con las credenciales proporcionadas
    const admin = admins.find(
      a => a.username === username && a.password === password
    );
    
    if (admin) {
      return { success: true, user: admin, isAdmin: true };
    } else {
      return { success: false, message: 'Nombre de usuario o contraseña incorrectos' };
    }
  } catch (error) {
    console.error('Error en el login de administrador:', error);
    return { success: false, message: 'Error de conexión con el servidor' };
  }
};

