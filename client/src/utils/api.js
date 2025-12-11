const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const apiCall = async (endpoint, options = {}, getToken) => {
  try {
    // Get fresh token from Clerk
    const token = await getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};
