import React from "react";
import MainLayout from "./layouts/MainLayout/MainLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import ApprovalLayout from "./layouts/ApprovalLayout/ApprovalLayout";
import FinanceLayout from "./layouts/FinanceLayout/FinanceLayout";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import { createBrowserRouter, RouterProvider } from "react-router";
import ProtectedRoute from "./routers/ProtectedRoute/ProtectedRoute";
import LoginPage from "./pages/LoginPage/LoginPage";
import UserLayout from "./layouts/UserLayout/UserLayout";
import AdminUserManagement from "./pages/AdminPage/AdminUserManagement";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <div>Home</div> },
      { path: "news", element: <div>News</div> },
      { path: "contact", element: <div>Contact</div> },
    ],
  },
  {
    path: "/admin",
    element: (
      // <ProtectedRoute requireAdmin={true}>
        <AdminLayout />
      // </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "usermanagement",
        children: [
          {
            path: "",
            element: <AdminUserManagement/>
          },
        ]
      }
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
    children: [{ path: "/approval", element: <div>Approval Dashboard</div> }],
  },
  {
    path: "/finance",
    element: (
      <ProtectedRoute requireFinance={true}>
        <FinanceLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [{ path: "/finance", element: <div>Finance Dashboard</div> }],
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute requireFinance={true}>
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
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
