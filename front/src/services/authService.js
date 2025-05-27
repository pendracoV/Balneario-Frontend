import { apiRequest, buildApiUrl } from '../config/api.js';
import API_CONFIG from '../config/api.js';

export const authService = {
  // Login
  login: async (credentials) => {
    return await apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Register
  register: async (userData) => {
    return await apiRequest(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Logout
  logout: async () => {
    return await apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });
  },

  // Forgot Password
  forgotPassword: async (email) => {
    return await apiRequest(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset Password
  resetPassword: async (token, newPassword) => {
    return await apiRequest(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ token, password: newPassword }),
    });
  },
};

export default authService;