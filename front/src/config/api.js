// Configuración de la API
const API_CONFIG = {
    // Usar la URL del .env o fallback al proxy en desarrollo
    BASE_URL: import.meta.env.VITE_API_URL 
      ? `${import.meta.env.VITE_API_URL}/api`
      : '/api',
    
    // Endpoints
    ENDPOINTS: {
      AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
      },
      USER: {
        PROFILE: '/user/profile',
        UPDATE_PROFILE: '/user/profile',
      },
      RESERVAS: {
        LIST: '/reservas',
        CREATE: '/reservas',
        UPDATE: '/reservas',
        DELETE: '/reservas',
      },
      ENTRADAS: {
        LIST: '/entradas',
        CREATE: '/entradas',
      },
      SERVICIOS: {
        LIST: '/servicios',
        CREATE: '/servicios',
      }
    }
  };
  
  // Función helper para construir URLs completas
  export const buildApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  };
  
  // Función helper para hacer peticiones con configuración base
  export const apiRequest = async (endpoint, options = {}) => {
    const url = buildApiUrl(endpoint);
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Para incluir cookies si las usas
      ...options,
    };
  
    // Agregar token de autorización si existe
    const token = localStorage.getItem('authToken');
    if (token) {
      defaultOptions.headers.Authorization = `Bearer ${token}`;
    }
  
    try {
      const response = await fetch(url, defaultOptions);
      
      // Si la respuesta no es ok, lanzar error
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  };
  
  export default API_CONFIG;