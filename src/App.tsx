import React, { useEffect, useState } from "react";
import MainLayout from "./layouts/MainLayout/MainLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import ApprovalLayout from "./layouts/ApprovalLayout/ApprovalLayout";
import FinanceLayout from "./layouts/FinanceLayout/FinanceLayout";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./routers/ProtectedRoute/ProtectedRoute";
import LoginPage from "./pages/LoginPage/LoginPage";

import AdminProject from "./pages/AdminPage/AdminProject";

import FinancePage from "./pages/FinancePage/FinancePage";
import UserLayout from "./layouts/UserLayout/UserLayout";
import HomePage from "./pages/HomePage/HomePage";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import ChangePassword from "./pages/LoginPage/ChangePassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "./context/UserContext";
import ApprovalPage from "./pages/ApprovalPage/ApprovalPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "about", element: <div>About Us</div> },
      { path: "contact", element: <div>Contact</div> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
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
    children: [{ path: "", element: <ApprovalPage/>}],
  },
  {
    path: "/finance",
    element: (
      <ProtectedRoute requireFinance={false}>
        <FinanceLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,

    children: [{ path: "/finance", element: <FinancePage /> }],
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute requireUser={true}>
        <UserLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [{ path: "/user", element: <div>User Dashboard</div> }],
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
    <>
      <UserProvider>
        {loading ? <LoadingScreen /> : <RouterProvider router={router} />}
        <ToastContainer />
      </UserProvider>
    </>
  );
};

export default App;
