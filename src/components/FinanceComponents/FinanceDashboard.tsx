import React from "react";
import { Bar } from "react-chartjs-2";
import { DataType } from "../../pages/FinancePage/FinancePage";

interface FinanceDashboardProps {
  data: DataType[];
}

const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ data }) => {
  // Calculate total hours
  const totalHours = data.reduce((sum, item) => {
    const hours = parseFloat(item.time.split(" ")[0]);
    return sum + hours;
  }, 0);

  // Prepare data for the bar chart
  const chartData = {
    labels: data.map((item) => item.project),
    datasets: [
      {
        label: "Hours",
        data: data.map((item) => parseFloat(item.time.split(" ")[0])),
        backgroundColor: "rgba(255, 145, 77, 0.6)",
        borderColor: "rgba(255, 145, 77, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="finance-dashboard">
      <h2 className="text-2xl font-bold mb-4">Finance Dashboard</h2>
      <div className="mb-4">
        <h3 className="text-xl">Total Hours: {totalHours}</h3>
      </div>
      <div className="chart-container">
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default FinanceDashboard;
