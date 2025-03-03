import React from "react";

import { Navigate } from "react-router";
import { toast } from "react-toastify";
import { checkRole, isAuthenticated } from "../../utils/userUtils";

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

  if (requireAdmin && !checkRole("A001")) {
    toast.error("You do not have access to this page.");
    return <Navigate to="/" />;
  }

  if (requireApproval && !checkRole("A003")) {
    toast.error("You do not have access to this page.");
    return <Navigate to="/" />;
  }

  if (requireFinance && !checkRole("A002")) {
    toast.error("You do not have access to this page.");
    return <Navigate to="/" />;
  }

  if (requireUser && !checkRole("A004")) {
    toast.error("You do not have access to this page.");
    return <Navigate to="/" />;
  }
  if (requireEditProfile && !checkRole("user")) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
