// src/api.js

const api = async (url, options = {}) => {

  const defaultOptions = {
    credentials: 'include', // Automatically include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };


  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
};

export default api;
