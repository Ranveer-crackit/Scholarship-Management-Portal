import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../authContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
     // Redirect to a specific unauthorized page or home/dashboard if role doesn't match
     console.warn(`Access denied for role: ${userRole}. Required: ${allowedRoles.join(', ')}`);
     // Maybe redirect to their own dashboard or a generic "access denied" page
     // For simplicity, redirecting to home here. Adjust as needed.
     return <Navigate to="/" replace />;
  }


  return children; // Render the component if authenticated and authorized
}

export default ProtectedRoute;