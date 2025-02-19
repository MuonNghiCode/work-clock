import React from "react";
import Dashboard from "../../../components/AdminComponents/DashBoard/DashBoard";

const AdminDashBoard: React.FC = () => {
  return (
    <div className="p-6 min-h-screen flex flex-col gap-6">
      <header className="p-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">
          Overview of system statistics and analytics
        </p>
      </header>

      <section>
        <Dashboard />
      </section>
    </div>
  );
};

export default AdminDashBoard;
