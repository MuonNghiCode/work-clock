import React from "react";
import { Outlet } from "react-router";
import { FaBell, FaUserCircle, FaEdit, FaTrash, FaClipboardList } from "react-icons/fa";
import AdminSidebar from "../Sidebar/AdminSidebar/AdminSidebar";
import AdminHeader from "../Header/AdminHeader/AdminHeader";

const projects = [
  { name: "Watermelon", date: "04/06/2025", status: "Processing" },
  { name: "Mango", date: "06/09/2025", status: "Pending" },
  { name: "Grape", date: "21/05/2025", status: "Processing" },
  { name: "Banana", date: "11/12/2025", status: "Pending" },
  { name: "Melon", date: "17/12/2025", status: "Complete" },
];

const statusColors: Record<string, string> = {
  Processing: "text-green-500",
  Pending: "text-red-500",
  Complete: "text-purple-500",
};

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <AdminHeader />

        <Outlet /> {/* This will render child routes */}

        {/* Project Management */}
        <div>
          <h1 className="text-2xl font-bold">Project Management</h1>

          {/* Search and Add Button */}
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search for project"
              className="border p-2 rounded-md w-1/3"
            />
            <button className="bg-orange-500 text-white px-4 py-2 rounded-md">
              + Add Project
            </button>
          </div>

          {/* Table */}
          <div className="bg-white shadow-md rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-orange-400 text-white">
                  <th className="p-2">Name</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 text-center">{project.name}</td>
                    <td className="p-2 text-center">{project.date}</td>
                    <td className={`p-2 text-center ${statusColors[project.status]}`}>
                      {project.status}
                    </td>
                    <td className="p-2 flex justify-center gap-2">
                      <FaEdit className="text-yellow-500 cursor-pointer" />
                      <FaTrash className="text-red-500 cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <button className="bg-orange-500 text-white px-3 py-1 rounded-md">1</button>
            <button className="mx-2">2</button>
            <button>3</button>
            <span>...</span>
            <button>68</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
