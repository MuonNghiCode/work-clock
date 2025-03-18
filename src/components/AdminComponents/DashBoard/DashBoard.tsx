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
import { motion } from "framer-motion";

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

const stats = {
  userCount: 120,
  activeUsers: 95,
  totalClaims: 250,
  approvedClaims: 180,
  rejectedClaims: 40,
  totalPaid: 4000000,
  totalProjects: 15,
  completedProjects: 10,
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const userData = {
  labels: ["Active", "Inactive"],
  datasets: [
    {
      data: [stats.activeUsers, stats.userCount - stats.activeUsers],
      backgroundColor: ["#3B82F6", "#FACC15"],
    },
  ],
};

const claimData = {
  labels: ["Approved", "Rejected", "Pending"],
  datasets: [
    {
      data: [
        stats.approvedClaims,
        stats.rejectedClaims,
        stats.totalClaims - stats.approvedClaims - stats.rejectedClaims,
      ],
      backgroundColor: ["#22C55E", "#EF4444", "#F59E0B"],
    },
  ],
};

const financeData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Total Paid (VND)",
      data: [1000000, 1500000, 2000000, 2500000, 3500000, stats.totalPaid],
      backgroundColor: "#EA580C",
      borderColor: "#EA580C",
      fill: false,
    },
  ],
};

const projectData = {
  labels: ["Completed", "Ongoing"],
  datasets: [
    {
      data: [
        stats.completedProjects,
        stats.totalProjects - stats.completedProjects,
      ],
      backgroundColor: ["#4ADE80", "#FB923C"],
    },
  ],
};

const fadeInScaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  bgColor: string;
  textColor: string;
}

const StatCard = ({
  icon,
  label,
  value,
  bgColor,
  textColor,
}: StatCardProps) => (
  <motion.div
    variants={fadeInScaleUp}
    initial="hidden"
    animate="visible"
    className={`p-6 rounded-xl flex flex-col items-center justify-center ${bgColor} bg-opacity-50 shadow-lg w-full text-center hover:scale-105 transition duration-300`}
  >
    <div className="p-3 bg-white rounded-full bg-opacity-30">{icon}</div>
    <p className={`text-lg font-medium ${textColor}`}>{label}</p>
    <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
  </motion.div>
);

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  bgColor: string;
}

const ChartCard = ({ title, children, bgColor }: ChartCardProps) => (
  <motion.div
    variants={fadeInScaleUp}
    initial="hidden"
    animate="visible"
    className={` rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ${bgColor} bg-opacity-30`}
  >
    <h2 className="mb-4 text-lg font-semibold text-center text-gray-900">
      {title}
    </h2>
    <div className="flex justify-center">{children}</div>
  </motion.div>
);

const Dashboard = () => (
  <div className="flex flex-col min-h-screen gap-12 ">
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatCard
        icon={<Icons.UserCount className="text-3xl text-blue-600" />}
        label="Total Users"
        value={stats.userCount}
        bgColor="bg-gradient-to-b from-blue-300 to-blue-100 p-6 rounded-xl shadow-lg relative hover:shadow-xl hover:bg-blue-400"
        textColor="text-black-900 font-bold"
      />
      <StatCard
        icon={<Icons.CircleCheck className="text-3xl text-green-600" />}
        label="Approved Claims"
        value={stats.approvedClaims}
        bgColor="bg-gradient-to-b from-green-300 to-green-100"
        textColor="text-black-900 font-bold"
      />
      <StatCard
        icon={<Icons.Money className="text-3xl text-yellow-500" />}
        label="Total Paid"
        value={`${stats.totalPaid} VND`}
        bgColor="bg-gradient-to-b from-yellow-300 to-yellow-100"
        textColor="text-black-900 font-bold"
      />
      <StatCard
        icon={<Icons.Project className="text-3xl text-orange-500" />}
        label="Completed Projects"
        value={stats.completedProjects}
        bgColor="bg-gradient-to-b from-orange-300 to-orange-100"
        textColor="text-black-900 font-bold"
      />
    </div>

    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      <ChartCard title="User Statistics" bgColor="bg-blue-100">
        <div className="w-64 h-64">
          <Pie data={userData} options={chartOptions} />
        </div>
      </ChartCard>
      <ChartCard title="Claim Requests" bgColor="bg-green-100">
        <div className="w-72 h-72">
          <Bar data={claimData} options={chartOptions} />
        </div>
      </ChartCard>
    </div>

    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      <ChartCard title="Financial Overview" bgColor="bg-orange-100">
        <div className="w-72 h-72">
          <Line data={financeData} options={chartOptions} />
        </div>
      </ChartCard>
      <ChartCard title="Project Statistics" bgColor="bg-yellow-100">
        <div className="w-64 h-64">
          <Pie data={projectData} options={chartOptions} />
        </div>
      </ChartCard>
    </div>
  </div>
);

export default Dashboard;
