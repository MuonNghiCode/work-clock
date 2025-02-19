import React from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

import Icons from "../../icon";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const userCount = 120;
const activeUsers = 95;
const inactiveUsers = userCount - activeUsers;
const totalClaims = 250;
const approvedClaims = 180;
const rejectedClaims = 40;
const pendingClaims = totalClaims - approvedClaims - rejectedClaims;
const totalPaid = 5000000;
const totalProjects = 15;
const completedProjects = 10;
const ongoingProjects = totalProjects - completedProjects;

const userData = {
  labels: ["Active Users", "Inactive Users"],
  datasets: [
    {
      data: [activeUsers, inactiveUsers],
      backgroundColor: ["#36A2EB", "#FFCE56"],
    },
  ],
};

const claimData = {
  labels: ["Approved", "Rejected", "Pending"],
  datasets: [
    {
      data: [approvedClaims, rejectedClaims, pendingClaims],
      backgroundColor: ["#82ca9d", "#ff6384", "#ffc658"],
    },
  ],
};

const financeData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Total Paid (VND)",
      data: [1000000, 1500000, 2000000, 2500000, 3500000, totalPaid],
      backgroundColor: "#FF9F40",
      borderColor: "#FF9F40",
      fill: false,
    },
  ],
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <div className="mb-10 p-6 bg-brand-orange-light-1 rounded-xl shadow-lg w-full">
    <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
      {title}
    </h2>
    {children}
  </div>
);

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}

const StatCard = ({ icon, label, value, color }: StatCardProps) => (
  <div
    className={`p-4 rounded-lg flex items-center gap-4 ${color} shadow-md w-full text-center justify-center`}
  >
    {icon}
    <div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const UserDashboard = () => (
  <Section title="User Statistics">
    <div className="grid grid-cols-1 gap-6">
      <StatCard
        icon={<Icons.UserCount className="text-3xl text-blue-500" />}
        label="Total Users"
        value={userCount}
        color="bg-blue-100"
      />
      <div className="flex justify-center">
        <Pie data={userData} className="w-16" />
      </div>
    </div>
  </Section>
);

const ClaimDashboard = () => (
  <Section title="Claim Requests">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={<Icons.CircleCheck className="text-3xl text-green-500" />}
        label="Approved"
        value={approvedClaims}
        color="bg-green-100"
      />
      <StatCard
        icon={<Icons.CircleReject className="text-3xl text-red-500" />}
        label="Rejected"
        value={rejectedClaims}
        color="bg-red-100"
      />
      <StatCard
        icon={<Icons.CirclePending className="text-3xl text-yellow-500" />}
        label="Pending"
        value={pendingClaims}
        color="bg-yellow-100"
      />
    </div>
    <div className="mt-6 flex justify-center">
      <Bar data={claimData} className="w-64" />
    </div>
  </Section>
);

const MoneyDashboard = () => (
  <Section title="Financial Overview">
    <div className="grid grid-cols-1 gap-6">
      <StatCard
        icon={<Icons.Money className="text-3xl text-orange-500" />}
        label="Total Paid"
        value={`${totalPaid} VND`}
        color="bg-orange-100"
      />
      <div className="flex justify-center">
        <Line data={financeData} className="w-64" />
      </div>
    </div>
  </Section>
);

const ProjectDashboard = () => (
  <Section title="Project Statistics">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard
        icon={<Icons.Project className="text-3xl text-blue-500" />}
        label="Completed"
        value={completedProjects}
        color="bg-blue-200"
      />
      <StatCard
        icon={<Icons.Project className="text-3xl text-yellow-500" />}
        label="Ongoing"
        value={ongoingProjects}
        color="bg-yellow-200"
      />
    </div>
    <div className="mt-6 flex justify-center">
      <Pie
        data={{
          labels: ["Completed", "Ongoing"],
          datasets: [
            {
              data: [completedProjects, ongoingProjects],
              backgroundColor: ["#4d94ff", "#ff9f40"],
            },
          ],
        }}
        className="w-64"
      />
    </div>
  </Section>
);

const Dashboard = () => (
  <div className="p-6 bg-transparent min-h-screen flex flex-col gap-10">
    <UserDashboard />
    <ClaimDashboard />
    <MoneyDashboard />
    <ProjectDashboard />
  </div>
);

export default Dashboard;
