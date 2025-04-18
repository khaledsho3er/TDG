// utils/PrivateRouteAdmin.js
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRouteAdmin = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin-login" />;
};

export default PrivateRouteAdmin;
