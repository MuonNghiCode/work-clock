import React from "react";
import { checkRole, isAuthenticated } from "../../services/authService";
import { Navigate } from "react-router";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  requireApproval?: boolean;
  requireEditProfile?: boolean;
  requireFinance?: boolean;
  requireUser?: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireAdmin,
  requireEditProfile,
  requireApproval,
  requireFinance,
  requireUser,
  children,
}) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !checkRole("admin")) {
    toast.error("You do not have access to this page.");
    return <Navigate to="/" />;
  }

  if (requireApproval && !checkRole("approval")) {
    toast.error("You do not have access to this page.");
    return <Navigate to="/" />;
  }

  if (requireFinance && !checkRole("finance")) {
    toast.error("You do not have access to this page.");
    return <Navigate to="/" />;
  }

  if (requireUser && !checkRole("user")) {
    toast.error("You do not have access to this page.");
    return <Navigate to="/" />;
  }
  if (requireEditProfile && !checkRole("user")) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
