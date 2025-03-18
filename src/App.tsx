import React, { useEffect, useState } from "react";
import MainLayout from "./layouts/MainLayout/MainLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import ApprovalLayout from "./layouts/ApprovalLayout/ApprovalLayout";
import FinanceLayout from "./layouts/FinanceLayout/FinanceLayout";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ProtectedRoute from "./routers/ProtectedRoute/ProtectedRoute";
import LoginPage from "./pages/LoginPage/LoginPage";
// import AdminProject from "./pages/AdminPage/AdminProject";
import AdminProject from "./pages/AdminPage/AdminProject/AdminProject";
import FinancePage from "./pages/FinancePage/FinancePage";
import FinanceDashBoardPage from "./pages/FinanceDashBoardPage/FinanceDashBoardPage";
import UserLayout from "./layouts/UserLayout/UserLayout";
import AdminUserManagement from "./pages/AdminPage/AdminUser/AdminUserManagement";
import HomePage from "./pages/HomePage/HomePage";

import EditProfilePage from "./pages/EditProfilePage/EditProfilePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "./contexts/UserContext";
import ApprovalPage from "./pages/ApprovalPage/ApprovalPage";
import RequestPage from "./pages/RequestPage/RequestPage";

import ApprovalDashBoardPage from "./pages/ApprovalDashBoardPage/ApprovalDashBoardPage";
import AdminDashBoard from "./pages/AdminPage/AdminDashboard/AdminDashBoard";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import UserDashboardPage from "./pages/UserPage/UserDashboardPage";
import UserCalendarPage from "./pages/UserCalendarPage/UserCalendarPage";
import useToastStorage from "./hooks/useToastStorage";
import { useLoadingStore } from "./config/zustand";
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";
import VerifyEmail from "./pages/VerifyEmailPage/VerifyEmail";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import AnimatedBackground from "./components/AnimatedBackground/AnimatedBackground";
import TableApproval from "./components/ApprovalComponents/TableApproval";
import UserProject from "./components/UserProject/UserProject";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [{ path: "/", element: <HomePage /> }],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requireAdmin={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <AdminDashBoard />,
      },
      {
        path: "user",
        element: <AdminUserManagement />,
      },
      {
        path: "project",
        element: <AdminProject />,
      },
      {
        path: "edit_profile",
        element: <EditProfilePage />,
      },
    ],
  },
  {
    path: "/approval",
    element: (
      <ProtectedRoute requireApproval={true}>
        <ApprovalLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "edit_profile",
        element: <EditProfilePage />,
      },
      {
        path: "edit_profile",
        element: <EditProfilePage />,
      },
      { path: "dashboard", element: <ApprovalDashBoardPage /> },
      { path: "approval-management", element: <ApprovalPage /> },
      { path: "/approval/dashboard", element: <ApprovalDashBoardPage /> },
      { path: "/approval/table-approval", element: <TableApproval /> },
    ],
  },
  {
    path: "/finance",
    element: (
      <ProtectedRoute requireFinance={true}>
        <FinanceLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,

    children: [
      {
        path: "",
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "edit_profile",
        element: <EditProfilePage />,
      },
      { path: "dashboard", element: <FinanceDashBoardPage /> },
      { path: "paid-management", element: <FinancePage /> },
    ],
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute requireUser={true}>
        <UserLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <UserDashboardPage />,
      },
      {
        path: "edit_profile",
        element: <EditProfilePage />,
      },
      {
        path: "request",
        element: <RequestPage />,
      },
      {
        path: "calendar",
        element: <UserCalendarPage />,
      },
      { path: "user-project", element: <UserProject /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/change-password",
    element: <ChangePassword />,
  },
  {
    path: "/verify-email/:token",
    element: <VerifyEmail />,
  },
]);

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const isLoading = useLoadingStore((state) => state.isLoading);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("visited");
    if (!hasVisited) {
      setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("visited", "true");
      }, 3000);
    } else {
      setLoading(false);
    }
  }, []);

  useToastStorage();

  return (
    <>
      <UserProvider>
        <AnimatedBackground />
        {isLoading && <LoadingScreen />}
        {loading ? <WelcomeScreen /> : <RouterProvider router={router} />}
        <ToastContainer />
      </UserProvider>
    </>
  );
};

export default App;
