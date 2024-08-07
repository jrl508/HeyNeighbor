import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AuthRoutes = () => {
  const { state } = useAuth();
  const token = localStorage.getItem("token");

  return state.isAuthenticated || token ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthRoutes;
