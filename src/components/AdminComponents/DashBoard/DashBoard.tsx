import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { getAllProject } from "../../../services/projectService";
import { getUsers } from "../../../services/userAuth";
import { getAllClaims } from "../../../services/claimService";
import { motion } from "framer-motion";
import Icons from "../../icon";

const fadeInScaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  bgColor: string;
  textColor: string;
};

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
    <div className="p-3 bg-white rounded-full bg-opacity-30 mb-4">{icon}</div>
    <p className={`text-lg font-medium ${textColor}`}>{label}</p>
    <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    unlockedUsers: 0,
    lockedUsers: 0,
    newProjects: 0,
    activeProjects: 0,
    pendingProjects: 0,
    closedProjects: 0,
    draftClaims: 0,
    pendingApprovalClaims: 0,
    approvedClaims: 0,
    paidClaims: 0,
    rejectedClaims: 0,
    canceledClaims: 0,
    totalProjects: 0,
    userCount: 0,
    totalClaims: 0,
  });

  const [currentCategory, setCurrentCategory] = useState<
    "Users" | "Projects" | "Claims"
  >("Users");
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["All"]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch unlocked and locked users
        const unlockedResponse = await getUsers(
          { keyword: "", is_blocked: false },
          { pageNum: 1, pageSize: 1 },
          true
        );
        const lockedResponse = await getUsers(
          { keyword: "", is_blocked: true },
          { pageNum: 1, pageSize: 1 },
          false
        );

        // Fetch all projects
        const projectResponse = await getAllProject({
          searchCondition: {
            keyword: "",
            project_start_date: "",
            project_end_date: "",
            user_id: "",
            is_delete: false,
          },
          pageInfo: { pageNum: 1, pageSize: 1000 },
        }, false);

        let newProjects = 0;
        let activeProjects = 0;
        let pendingProjects = 0;
        let closedProjects = 0;

        if (projectResponse.success) {
          const projects = projectResponse.data.pageData;
          newProjects = projects.filter(
            (p: { project_status: string }) => p.project_status === "New"
          ).length;
          activeProjects = projects.filter(
            (p: { project_status: string }) => p.project_status === "Active"
          ).length;
          pendingProjects = projects.filter(
            (p: { project_status: string }) => p.project_status === "Pending"
          ).length;
          closedProjects = projects.filter(
            (p: { project_status: string }) => p.project_status === "Closed"
          ).length;
        }

        // Fetch claims by status
        const claimStatuses = [
          "Draft",
          "Pending Approval",
          "Approved",
          "Paid",
          "Rejected",
          "Canceled",
        ];
        const claimCounts = await Promise.all(
          claimStatuses.map(async (status) => {
            const response = await getAllClaims({
              searchCondition: {
                keyword: "",
                claim_status: status,
                project_start_date: "",
                project_end_date: "",
                is_delete: false,
              },
              pageInfo: { pageNum: 1, pageSize: 1 },
            }, false);
            return response.success
              ? response.data.pageInfo.totalItems || 0
              : 0;
          })
        );

        setStats({
          unlockedUsers: unlockedResponse.data.pageInfo.totalItems || 0,
          lockedUsers: lockedResponse.data.pageInfo.totalItems || 0,
          newProjects,
          activeProjects,
          pendingProjects,
          closedProjects,
          totalProjects:
            newProjects + activeProjects + pendingProjects + closedProjects,
          draftClaims: claimCounts[0],
          pendingApprovalClaims: claimCounts[1],
          approvedClaims: claimCounts[2],
          paidClaims: claimCounts[3],
          rejectedClaims: claimCounts[4],
          canceledClaims: claimCounts[5],
          totalClaims: claimCounts.reduce((sum, count) => sum + count, 0),
          userCount:
            (unlockedResponse.data.pageInfo.totalItems || 0) +
            (lockedResponse.data.pageInfo.totalItems || 0),
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  const getChartOptions = () => {
    let categories: string[] = [];
    let data: number[] = [];

    if (currentCategory === "Users") {
      categories = ["Unlocked Users", "Locked Users"];
      data = [stats.unlockedUsers, stats.lockedUsers];
    } else if (currentCategory === "Projects") {
      categories = ["New", "Active", "Pending", "Closed"];
      data = [
        stats.newProjects,
        stats.activeProjects,
        stats.pendingProjects,
        stats.closedProjects,
      ];
    } else if (currentCategory === "Claims") {
      categories = [
        "Draft",
        "Pending Approval",
        "Approved",
        "Paid",
        "Rejected",
        "Canceled",
      ];
      data = [
        stats.draftClaims,
        stats.pendingApprovalClaims,
        stats.approvedClaims,
        stats.paidClaims,
        stats.rejectedClaims,
        stats.canceledClaims,
      ];
    }

    // Apply filters
    if (!selectedFilters.includes("All")) {
      const filteredCategories: string[] = [];
      const filteredData: number[] = [];
      selectedFilters.forEach((filter) => {
        const index = categories.indexOf(filter);
        if (index !== -1) {
          filteredCategories.push(categories[index]);
          filteredData.push(data[index]);
        }
      });
      categories = filteredCategories;
      data = filteredData;
    }

    return {
      title: {
        text: `${currentCategory} Overview`,
        left: "center",
        textStyle: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#333",
        },
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#fff",
        borderColor: "#ccc",
        borderWidth: 1,
        textStyle: {
          color: "#333",
        },
      },
      grid: {
        top: "15%",
        left: "5%",
        right: "5%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: categories,
        axisLabel: {
          fontSize: 12,
          color: "#666",
        },
        axisLine: {
          lineStyle: {
            color: "#ccc",
          },
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          fontSize: 12,
          color: "#666",
        },
        axisLine: {
          lineStyle: {
            color: "#ccc",
          },
        },
        splitLine: {
          lineStyle: {
            color: "#eee",
          },
        },
      },
      series: [
        {
          data,
          type: "bar",
          barWidth: "50%",
          itemStyle: {
            color: (params: any) => {
              const colors = [
                "#60A5FA",
                "#34D399",
                "#F59E0B",
                "#6B7280",
                "#A78BFA",
                "#FBBF24",
              ];
              return colors[params.dataIndex % colors.length];
            },
            borderRadius: [5, 5, 0, 0],
          },
        },
      ],
    };
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilters((prev) => {
      if (filter === "All") {
        return ["All"];
      }
      const newFilters = prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev.filter((f) => f !== "All"), filter];
      return newFilters.length === 0 ? ["All"] : newFilters;
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 px-4">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <StatCard
          icon={<Icons.UserCount className="text-3xl text-blue-600" />}
          label="Total Users"
          value={stats.userCount}
          bgColor="bg-gradient-to-b from-blue-300 to-blue-100"
          textColor="text-black-900 font-bold"
        />
        <StatCard
          icon={<Icons.Project className="text-3xl text-orange-500" />}
          label="Total Projects"
          value={stats.totalProjects}
          bgColor="bg-gradient-to-b from-orange-300 to-orange-100"
          textColor="text-black-900 font-bold"
        />
        <StatCard
          icon={<Icons.FileText className="text-3xl text-purple-600" />}
          label="Total Claims"
          value={stats.totalClaims}
          bgColor="bg-gradient-to-b from-purple-300 to-purple-100"
          textColor="text-black-900 font-bold"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full">
        <div className="flex justify-between items-center mb-4">
          {/* Section Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentCategory("Users")}
              className={`px-4 py-2 rounded ${currentCategory === "Users"
                ? "bg-[#ff914d] text-white"
                : "bg-gray-200"
                }`}
            >
              Users
            </button>
            <button
              onClick={() => setCurrentCategory("Projects")}
              className={`px-4 py-2 rounded ${currentCategory === "Projects"
                ? "bg-[#ff914d] text-white"
                : "bg-gray-200"
                }`}
            >
              Projects
            </button>
            <button
              onClick={() => setCurrentCategory("Claims")}
              className={`px-4 py-2 rounded ${currentCategory === "Claims"
                ? "bg-[#ff914d] text-white"
                : "bg-gray-200"
                }`}
            >
              Claims
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-4">
            {["All", ...getChartOptions().xAxis.data].map((status) => (
              <button
                key={status}
                onClick={() => handleFilterChange(status)}
                className={`px-4 py-2 rounded ${selectedFilters.includes(status)
                  ? "bg-[#ff914d] text-white"
                  : "bg-gray-200 text-gray-700"
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <ReactECharts
          option={getChartOptions()}
          style={{ height: 400, width: "100%" }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
