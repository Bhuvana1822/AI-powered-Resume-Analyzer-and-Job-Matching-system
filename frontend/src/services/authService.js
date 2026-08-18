import api from './api';

export const authService = {
  async register(name, email, password) {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
