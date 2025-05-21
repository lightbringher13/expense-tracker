// 1) Import the axios library
import axios from 'axios';

// 2) Create a new instance of axios with defaults
const axiosClient = axios.create({
  baseURL: '/api',   // all requests will be relative to /api
  // you can also add default headers, timeout, etc. here
});

// 3) Add a request interceptor to include the JWT automatically
axiosClient.interceptors.request.use(
  config => {
    // a) Read the token from localStorage
    const token = localStorage.getItem('token');
    // b) If we have one, set the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // c) Must return the config object
    return config;
  },
  error => {
    // d) If something went wrong before sending, reject the promise
    return Promise.reject(error);
  }
);

// 4) (Optional) Add a response interceptor for global error handling
axiosClient.interceptors.response.use(
  response => response,          // a) On success, just pass the response through
  error => {
    // b) If we get a 401 Unauthorized, clear the token
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // you could also redirect to login here:
      // window.location.href = '/login';
    }
    // c) Reject so individual calls can still handle errors if they want
    return Promise.reject(error);
  }
);

// 5) Export the configured instance for use elsewhere
export default axiosClient;