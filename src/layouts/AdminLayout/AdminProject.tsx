import React, { useState } from "react";
import { Outlet } from "react-router";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import AdminSidebar from "../Sidebar/AdminSidebar/AdminSidebar";
import AdminHeader from "../Header/AdminHeader/AdminHeader";

const projects = [
  { name: "Watermelon", date: "04/06/2025", status: "Processing" },
  { name: "Mango", date: "06/09/2025", status: "Pending" },
  { name: "Grape", date: "21/05/2025", status: "Processing" },
  { name: "Banana", date: "11/12/2025", status: "Pending" },
  { name: "Melon", date: "17/12/2025", status: "Complete" },
];

const statusColors = {
  Processing: "text-green-500",
  Pending: "text-red-500",
  Complete: "text-purple-500",
};

const ProjectTable = ({ projects }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <table className="w-full">
        <thead>
          <tr className="bg-orange-400 text-white rounded-lg">
            <th className="p-3">Name</th>
            <th className="p-3">Date</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.name} className="bg-gray-100 hover:bg-gray-200 rounded-md shadow p-3 m-2">
              <td className="p-3 text-center font-semibold">{project.name}</td>
              <td className="p-3 text-center">{project.date}</td>
              <td className={`p-3 text-center font-semibold ${statusColors[project.status]}`}>{project.status}</td>
              <td className="p-3 flex justify-center gap-4">
                <FaEdit className="text-yellow-500 cursor-pointer" />
                <FaTrash className="text-red-500 cursor-pointer" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AdminLayout = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 68;

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <AdminHeader />
        <Outlet />
        <div>
          <h1 className="text-2xl font-bold mb-4">Project Management</h1>
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search for project"
              className="border p-2 rounded-md w-1/3"
            />
            <button className="bg-orange-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
              <FaPlus /> Add Project
            </button>
          </div>
          <ProjectTable projects={projects} />
          <div className="flex justify-center mt-4 gap-2">
            <button
              className={`px-3 py-1 rounded-md ${currentPage === 1 ? "bg-orange-500 text-white" : "bg-gray-200"}`}
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
            {currentPage > 3 && <span className="px-2">...</span>}
            {[currentPage - 1, currentPage, currentPage + 1]
              .filter((page) => page > 1 && page < totalPages)
              .map((page) => (
                <button
                  key={page}
                  className={`px-3 py-1 rounded-md ${currentPage === page ? "bg-orange-500 text-white" : "bg-gray-200"}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            {currentPage < totalPages - 2 && <span className="px-2">...</span>}
            <button
              className={`px-3 py-1 rounded-md ${currentPage === totalPages ? "bg-orange-500 text-white" : "bg-gray-200"}`}
              onClick={() => setCurrentPage(totalPages)}
            >
              {totalPages}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
