const API_URL = 'http://localhost:3000';

// Función para iniciar sesión como alumno
export const loginUser = async (legajo, password) => {
  try {
    console.log('Intentando login con:', { legajo });
    
    // Usar el endpoint específico de login con método POST
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ legajo, password }),
    });
    
    console.log('Respuesta del servidor:', response.status, response.statusText);
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      let errorMessage = 'Error al conectar con el servidor';
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          // Si no es JSON, obtener el texto de la respuesta
          const text = await response.text();
          console.error('Respuesta no JSON:', text.substring(0, 100) + '...');
          errorMessage = 'El servidor no está respondiendo correctamente';
        }
      } catch (e) {
        console.error('Error al procesar la respuesta:', e);
      }
      throw new Error(errorMessage);
    }
    
    // Procesar la respuesta
    const data = await response.json();
    
    if (data.success) {
      // Guardar el token en localStorage para usarlo en futuras peticiones
      localStorage.setItem('authToken', data.token);
      
      return { 
        success: true, 
        user: data.alumno, 
        isAdmin: data.isAdmin,
        token: data.token
      };
    } else {
      return { 
        success: false, 
        message: data.error || 'Credenciales inválidas' 
      };
    }
  } catch (error) {
    console.error('Error detallado en el login:', error);
    return { 
      success: false, 
      message: error.message || 'Error de conexión con el servidor' 
    };
  }
};

// Función para iniciar sesión como administrador
export const loginAdmin = async (username, password) => {
  try {
    // Usar el endpoint específico de login para administradores con método POST
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al conectar con el servidor');
    }
    
    // Procesar la respuesta
    const data = await response.json();
    
    if (data.success) {
      // Guardar el token en localStorage para usarlo en futuras peticiones
      localStorage.setItem('authToken', data.token);
      
      return { 
        success: true, 
        user: data.usuario, 
        isAdmin: data.isAdmin,
        token: data.token
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
    // Enviar los datos al endpoint de usuarios con método POST
    const registerResponse = await fetch(`${API_URL}/users`, {
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

// Función para obtener el token de autenticación
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Función para cerrar sesión
export const logout = () => {
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('currentUser');
  sessionStorage.removeItem('isAdmin');
};

// Función para realizar peticiones autenticadas
export const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }
  
  const authOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  };
  
  const response = await fetch(url, authOptions);
  
  if (response.status === 401) {
    // Token inválido o expirado
    logout();
    window.location.href = '/';
    throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
  }
  
  return response;
};