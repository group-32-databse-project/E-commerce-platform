import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve token from localStorage on component mount
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.customerId, username: decoded.username });
      } catch (error) {
        console.error('Invalid token:', error);
        setAuthToken(null);
        setUser(null);
      }
    }
  }, []);

  // Function to handle login
  const login = (token) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
    try {
      const decoded = jwtDecode(token);
      setUser({ id: decoded.customerId, username: decoded.username });
    } catch (error) {
      console.error('Invalid token during login:', error);
      setAuthToken(null);
      setUser(null);
    }
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
