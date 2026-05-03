import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

export const subjectService = {
  getAll: () => api.get('/subjects'),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
  addSession: (id, data) => api.post(`/subjects/${id}/sessions`, data),
  updateSession: (subjectId, sessionId, data) => api.put(`/subjects/${subjectId}/sessions/${sessionId}`, data),
  completeSession: (subjectId, sessionId) => api.put(`/subjects/${subjectId}/sessions/${sessionId}/complete`),
  deleteSession: (subjectId, sessionId) => api.delete(`/subjects/${subjectId}/sessions/${sessionId}`),
  findOrCreate: (data) => api.post('/subjects/find-or-create', data)
};

export const notesService = {
  getAll: () => api.get('/notes'),
  create: (formData) => api.post('/notes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/notes/${id}`)
};