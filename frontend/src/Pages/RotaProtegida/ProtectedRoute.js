import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext/AuthProvider';

const ProtectedRoute = ({ element: Component, role, params, ...rest }) => {
  const { user } = useContext(AuthContext);


  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    console.log('User role does not match:', user.role);
    return <Navigate to="/login" replace />;
  }


  return <Component {...params} {...rest} />;
};

export default ProtectedRoute;
