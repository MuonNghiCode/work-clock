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
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";

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
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import UserCalendarPage from "./pages/UserCalendarPage/UserCalendarPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "about", element: <ProfilePage /> },
      { path: "contact", element: <div>Contact</div> },
    ],
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
      { path: "dashboard", element: <ApprovalDashBoardPage /> },
      { path: "approval-management", element: <ApprovalPage /> },
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
]);

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

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

  return (
    <UserProvider>
      {loading ? <LoadingScreen /> : <RouterProvider router={router} />}
      <ToastContainer />
    </UserProvider>
  );
};

export default App;
