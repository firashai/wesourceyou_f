import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://wesourceyoub2.vercel.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  registerJournalist: (journalistData) => api.post('/auth/register-journalist', journalistData),
  registerCompany: (companyData) => api.post('/auth/register-company', companyData),
  getProfile: () => api.get('/auth/profile'),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.patch(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Journalists API
export const journalistsAPI = {
  getAll: (params) => api.get('/journalists', { params }),
  getById: (id) => api.get(`/journalists/${id}`),
  create: (data) => api.post('/journalists', data),
  update: (id, data) => api.patch(`/journalists/${id}`, data),
  delete: (id) => api.delete(`/journalists/${id}`),
  search: (params) => api.get('/journalists/search', { params }),
  getByLocation: (location) => api.get(`/journalists/location/${location}`),
  getByMediaType: (mediaType) => api.get(`/journalists/media-type/${mediaType}`),
};

// Companies API
export const companiesAPI = {
  getAll: (params) => api.get('/companies', { params }),
  getById: (id) => api.get(`/companies/${id}`),
  create: (data) => api.post('/companies', data),
  update: (id, data) => api.patch(`/companies/${id}`, data),
  delete: (id) => api.delete(`/companies/${id}`),
  getVerified: () => api.get('/companies/verified'),
};

// Media Content API
export const mediaAPI = {
  getAll: (params) => api.get('/media-content', { params }),
  getById: (id) => api.get(`/media-content/${id}`),
  create: (data) => api.post('/media-content', data),
  update: (id, data) => api.patch(`/media-content/${id}`, data),
  delete: (id) => api.delete(`/media-content/${id}`),
  upload: (formData) => api.post('/media-content/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  purchase: (id, purchaseData) => api.post(`/media-content/${id}/purchase`, purchaseData),
  getFeatured: () => api.get('/media-content/featured'),
  search: (params) => api.get('/media-content/search', { params }),
};

// Jobs API
export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.patch(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  apply: (id, applicationData) => api.post(`/jobs/${id}/apply`, applicationData),
  getApplications: (id) => api.get(`/jobs/${id}/applications`),
  updateApplicationStatus: (jobId, applicationId, status) => 
    api.patch(`/jobs/${jobId}/applications/${applicationId}`, { status }),
  search: (params) => api.get('/jobs/search', { params }),
};

// Search API
export const searchAPI = {
  global: (query, params) => api.get('/search', { params: { query, ...params } }),
  journalists: (params) => api.get('/search/journalists', { params }),
  jobs: (params) => api.get('/search/jobs', { params }),
  suggestions: (query) => api.get('/search/suggestions', { params: { query } }),
};

// File upload helper
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

export default api;
