import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AuthRoutes = () => {
  const { state } = useAuth();

  return state.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthRoutes;
