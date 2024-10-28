import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Adjust based on your storage strategy

  return token ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;

