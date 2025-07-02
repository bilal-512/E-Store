import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this if your backend is deployed
});

// Set auth token from localStorage on initialization
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
