import api from './api';

export const resumeService = {
  async uploadResume(file, userId) {
    const formData = new FormData();
    formData.append('file', file);
    if (userId) {
      formData.append('userId', userId);
    }

    const response = await api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }
};
