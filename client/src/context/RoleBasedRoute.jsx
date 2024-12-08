// RoleBasedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBasedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== requiredRole) {
    return <Navigate to="/" />; // Redirect to home or a "403 Forbidden" page
  }

  return children;
};

export default RoleBasedRoute;
