import React from "react";
import MainLayout from "./layouts/MainLayout/MainLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import ApprovalLayout from "./layouts/ApprovalLayout/ApprovalLayout";
import FinanceLayout from "./layouts/FinanceLayout/FinanceLayout";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import { createBrowserRouter, RouterProvider } from "react-router";
import ProtectedRoute from "./routers/ProtectedRoute/ProtectedRoute";
import LoginPage from "./pages/LoginPage/LoginPage";
import AdminProject from "./layouts/AdminLayout/AdminProject";


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
      // <ProtectedRoute requireAdmin={false}>
        <AdminLayout />
      // </ProtectedRoute> 
    ),
    errorElement: <ErrorPage />,
    children: [{ path: "/admin", element: <AdminProject/> }
    
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
    path: "/login",
    element: <LoginPage />,
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
