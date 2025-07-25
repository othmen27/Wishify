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