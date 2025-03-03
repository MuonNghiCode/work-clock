import React from "react";
import FinanceDashboard from "../../components/FinanceComponents/FinanceDashboard";

const FinanceDashboardPage: React.FC = () => {
  return (
    <div className="mx-auto p-1">
      <h1 className="text-[40px] font-bold mb-2">Finance Dashboard</h1>
      <div className="w-full mx-auto">
        <FinanceDashboard />
      </div>
    </div>
  );
};

export default FinanceDashboardPage;
