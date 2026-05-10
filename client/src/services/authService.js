import { apiClient } from '../utils/apiClient';

/**
 * Auth Service for User Management
 */
export const authService = {
  /**
   * Logs in a user
   */
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.status === 'success' && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.status === 'success' ? response.data : response;
  },

  /**
   * Registers a new user
   */
  async signup(userData) {
    const response = await apiClient.post('/auth/signup', userData);
    return response.status === 'success' ? response.data : response;
  },

  /**
   * Logs out the user
   */
  async logout() {
    localStorage.removeItem('auth_token');
    // Optionally call backend logout endpoint
    return { status: 'success' };
  }
};

export default authService;
