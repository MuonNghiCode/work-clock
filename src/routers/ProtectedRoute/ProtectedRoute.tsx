import React from "react";
import { checkRole, isAuthenticated } from "../../services/auth";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  requireApproval?: boolean;
  requireFinance?: boolean;
  requireUser?: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireAdmin,
  requireApproval,
  requireFinance,
  requireUser,
  children,
}) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !checkRole("admin")) {
    return <Navigate to="/" />;
  }

  if (requireApproval && !checkRole("approval")) {
    return <Navigate to="/" />;
  }

  if (requireFinance && !checkRole("finance")) {
    return <Navigate to="/" />;
  }

  if (requireUser && !checkRole("user")) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
