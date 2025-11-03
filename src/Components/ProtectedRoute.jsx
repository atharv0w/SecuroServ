import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("sv_token");

  // ✅ Strict token validation
  if (
    !token ||
    token === "null" ||
    token === "undefined" ||
    token.trim() === "" ||
    token.split(".").length !== 3
  ) {
    console.warn("[ProtectedRoute] Invalid or missing token → redirecting to login");
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      console.warn("[ProtectedRoute] Token expired → clearing session");
      localStorage.removeItem("sv_token");
      localStorage.removeItem("sv_role");
      localStorage.removeItem("sv_user");
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    console.error("[ProtectedRoute] Token validation failed:", err.message);
    localStorage.removeItem("sv_token");
    localStorage.removeItem("sv_role");
    localStorage.removeItem("sv_user");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
