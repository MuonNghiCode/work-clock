import React from "react";
import { data } from "../FinancePage/FinancePage"; // Adjust the import path as necessary
import FinanceDashboard from "../../components/FinanceComponents/FinanceDashboard";

const FinanceDashboardPage: React.FC = () => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Finance Dashboard</h1>
      <div className="lg:w-10/12 w-full mx-auto">
        <FinanceDashboard data={data} />
      </div>
    </>
  );
};

export default FinanceDashboardPage;
