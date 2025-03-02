import React from "react";
import FinanceDashboard from "../../components/FinanceComponents/FinanceDashboard";

const FinanceDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Finance Dashboard</h1>
      <div className="lg:w-10/12 w-full mx-auto">
        <FinanceDashboard />
      </div>
    </div>
  );
};

export default FinanceDashboardPage;
