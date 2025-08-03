import config from '../config';

// Check if user is logged in
export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get current user data
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Set auth header for API requests
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get wishes
export const getWishes = async () => {
  const response = await fetch(`${config.getApiUrl()}/api/wishes`, {
    method: 'GET',
    headers: getAuthHeader(),
    });
    const data = await response.json();
    const wishes = data.wishes;
    return wishes;
};

// Get public wishes for discover feed
export const getPublicWishes = async () => {
  try {
    const response = await fetch(`${config.getApiUrl()}/api/wishes/public`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.wishes || [];
  } catch (error) {
    console.error('Error fetching public wishes:', error);
    return [];
  }
};