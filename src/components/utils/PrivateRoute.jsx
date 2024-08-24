
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ ...rest }) => {
  return localStorage.getItem('authToken') ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;