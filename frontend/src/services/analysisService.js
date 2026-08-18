import api from './api';

export const analysisService = {
  async analyze(payload) {
    const response = await api.post('/matching/analyze', payload);
    return response.data;
  },

  async getAnalysis(id) {
    const response = await api.get(`/matching/analysis/${id}`);
    return response.data;
  },

  async getHistory(userId) {
    const params = userId ? { userId } : {};
    const response = await api.get('/matching/history', { params });
    return response.data;
  },

  async getDashboard(userId) {
    const params = userId ? { userId } : {};
    const response = await api.get('/matching/dashboard', { params });
    return response.data;
  }
};
