// UserContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode'; // Use the default import

// Create the context
const UserContext = createContext();

// UserProvider component to provide the userId globally
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get the refreshToken from cookies
    const refreshToken = Cookies.get('refreshToken'); // Ensure the token is stored in cookies
    if (refreshToken) {
      try {
        // Decode the token
        const decodedToken = jwtDecode(refreshToken); // Use the default import here
        // Extract userId (or _id) from the token payload
        const userIdFromToken = decodedToken._id || decodedToken.userId;
        setUserId(userIdFromToken);
      } catch (error) {
        console.error('Error decoding the token:', error);
      }
    } else {
      console.log('No access token found in cookies.');
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use the userId in any component
export const useUser = () => useContext(UserContext);
