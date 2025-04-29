import axios from 'axios';

// IMPORTANT: Replace with your actual backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle 401 Unauthorized (e.g., redirect to login)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - 401");
      // Optionally clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      // You might want to use window.location or a more sophisticated redirect mechanism
      // if you're not within a component that has access to navigate()
      // window.location.href = '/login';
    }
     if (error.response && error.response.status === 403) {
      console.error("Forbidden access - 403");
      // Handle forbidden access appropriately, maybe show a message
    }
    return Promise.reject(error);
  }
);


export default api;

// --- Specific API functions (Example) ---

// Auth
export const signupUser = (userData) => api.post('/auth/signup', userData);
export const loginUser = (credentials) => api.post('/auth/Login', credentials); // Ensure endpoint matches backend '/Login'

// Student
export const fetchStudentScholarships = () => api.get('/student/scholarships');
export const applyForScholarship = (data) => api.post('/student/apply', data);
export const fetchStudentApplications = () => api.get('/student/applications');
export const saveStudentDetails = (details) => api.post('/student/fill_details', details);

// Institution
export const fetchPendingApplications = () => api.get('/institution/applications/pending');
export const verifyInstApplication = (appId) => api.put(`/institution/applications/verify/${appId}`);
export const saveInstitutionDetails = (details) => api.post('/institution/institution_details', details);

// Government
export const fetchGovVerifiedApps = () => api.get('/government/verified-applications');
export const approveGovApplication = (appId) => api.post(`/government/approve/${appId}`);
export const createScholarship = (scholarshipData) => api.post('/government/applications', scholarshipData);
export const fetchGovApprovedAppsForPayment = () => api.get('/government/approved-for-payment'); // Corrected endpoint from backend routes

// Payment (Example - assuming called by Government)
export const fetchAllPayments = () => api.get('/payment/all');
export const makePaymentForApp = (appId, paymentData) => api.post(`/payment/make/${appId}`, paymentData);