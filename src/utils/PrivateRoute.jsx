// src/utils/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if the token exists in localStorage

  return isAuthenticated ? Component : <Navigate to="/" />;
};

export default PrivateRoute;
