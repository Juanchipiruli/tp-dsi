const API_URL = 'https://backenddsi.onrender.com';

// Función para iniciar sesión como alumno
export const loginUser = async (legajo, password) => {
  try {
    // Usar el endpoint específico de login
    const response = await fetch(`${API_URL}/login?legajo=${legajo}&password=${password}`);
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al conectar con el servidor');
    }
    
    // Procesar la respuesta
    const data = await response.json();
    
    if (data.success) {
      return { 
        success: true, 
        user: data.alumno, 
        isAdmin: data.isAdmin 
      };
    } else {
      return { 
        success: false, 
        message: data.error || 'Credenciales inválidas' 
      };
    }
  } catch (error) {
    console.error('Error en el login:', error);
    return { 
      success: false, 
      message: error.message || 'Error de conexión con el servidor' 
    };
  }
};

// Función para iniciar sesión como administrador
export const loginAdmin = async (username, password) => {
  try {
    // Usar el endpoint específico de login para administradores
    const response = await fetch(`${API_URL}/admin/login?username=${username}&password=${password}`);
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al conectar con el servidor');
    }
    
    // Procesar la respuesta
    const data = await response.json();
    
    if (data.success) {
      return { 
        success: true, 
        user: data.usuario, 
        isAdmin: data.isAdmin 
      };
    } else {
      return { 
        success: false, 
        message: data.error || 'Credenciales inválidas' 
      };
    }
  } catch (error) {
    console.error('Error en el login de administrador:', error);
    return { 
      success: false, 
      message: error.message || 'Error de conexión con el servidor' 
    };
  }
};

// Función para registrar un nuevo usuario
export const registerUser = async (userData) => {
  try {
    // Enviar los datos al endpoint de alumnos
    const registerResponse = await fetch(`${API_URL}/alumnos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!registerResponse.ok) {
      const errorData = await registerResponse.json();
      throw new Error(errorData.error || 'Error al registrar usuario');
    }
    
    const newUser = await registerResponse.json();
    return { success: true, user: newUser };
  } catch (error) {
    console.error('Error en el registro:', error);
    return { 
      success: false, 
      message: error.message || 'Error de conexión con el servidor' 
    };
  }
};

