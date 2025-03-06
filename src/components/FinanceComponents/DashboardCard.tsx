import React from "react";
import Icons from "../icon"; // Adjust the import path as necessary

interface DashboardCardProps {
  title: string;
  count: number;
  label: string;
  icon: React.ElementType;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  count,
  label,
  icon: Icon,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow relative hover:bg-gray-100 transition-colors duration-200">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-2xl text-blue-600">{count}</p>
      <p className="text-sm text-gray-500">{label}</p>
      <span className="absolute top-2 right-2 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full p-2">
        <Icon className="lg:w-20 w-12 h-auto text-white" />
      </span>
    </div>
  );
};

export default DashboardCard;
