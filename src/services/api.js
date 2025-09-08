import axios from 'axios';

// Production URL - localhost से बदलकर production URL
const API_BASE_URL = 'https://hohoindiabackend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout for production
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // For FormData, let browser set Content-Type automatically
  if (config.data instanceof FormData) {
    // Remove Content-Type header for FormData
    delete config.headers['Content-Type'];
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (userData) => api.post('/auth/login', userData),
};

// Event API endpoints
export const eventAPI = {
  create: (eventData) => {
    return api.post('/events', eventData);
  },
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  getPublicById: (id) => api.get(`/events/public/${id}`), // Public endpoint जो आपके registration component में use हो रहा है
  getRegistrations: (eventId) => api.get(`/events/${eventId}/registrations`),
  update: (eventId, eventData) => api.put(`/events/${eventId}`, eventData),
  delete: (eventId) => api.delete(`/events/${eventId}`),
};

// Registration API endpoints
export const registrationAPI = {
  register: (eventId, data) => api.post(`/registrations/${eventId}`, data),
  export: (eventId) => api.get(`/registrations/${eventId}/export`, {
    responseType: 'blob', 
  }),
};

export default api;
