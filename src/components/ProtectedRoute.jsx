import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  if (!user) {
    // Not logged in
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Logged in but not allowed
    return <Navigate to="/user" replace />; // redirect patient/other users
  }

  return children;
};

export default ProtectedRoute;