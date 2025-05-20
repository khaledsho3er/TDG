import axios from 'axios';

// Create a custom axios instance with retry logic
const apiClient = axios.create({
  baseURL: 'https://api.thedesigngrit.com/api',
  timeout: 15000, // 15 seconds timeout
});

// Add request interceptor for authentication if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens if needed
    const userSession = localStorage.getItem('user');
    if (userSession) {
      try {
        const user = JSON.parse(userSession);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error('Error parsing user session:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor with retry logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    
    // If the request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (response && response.status >= 500) {
      // Server error, might be temporary
      if (!config._retry) {
        config._retry = true;
        return new Promise((resolve) => {
          // Wait 1 second before retrying
          setTimeout(() => resolve(apiClient(config)), 1000);
        });
      }
    }
    
    return Promise.reject(error);
  }
);

// Fetch with retry utility function
export const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      retries++;
      if (retries === maxRetries) {
        throw error;
      }
      // Exponential backoff: wait longer between each retry
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries - 1)));
    }
  }
};

export default apiClient;