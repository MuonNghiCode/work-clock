import { useState } from "react";
import { Outlet } from "react-router";
import { FaPencilAlt, FaTrashAlt, FaPlus, FaSearch, FaShareAlt } from "react-icons/fa";
import AdminSidebar from "../Sidebar/AdminSidebar/AdminSidebar";
import AdminHeader from "../Header/AdminHeader/AdminHeader";

interface Project {
  name: string;
  date: string;
  status: 'Processing' | 'Pending' | 'Complete';
}

const projects: Project[] = [
  { name: "Watermelon", date: "04/06/2025", status: "Processing" },
  { name: "Mango", date: "06/09/2025", status: "Pending" },
  { name: "Grape", date: "27/05/2025", status: "Processing" },
  { name: "Banana", date: "11/12/2025", status: "Pending" },
  { name: "Melon", date: "17/12/2025", status: "Complete" },
];

const statusColors = {
  Processing: "text-green-500",
  Pending: "text-red-500",
  Complete: "text-purple-500",
} as const;

interface ProjectTableProps {
  projects: Project[];
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
  return (
    <div className="w-full">
      <div className="bg-orange-300 text-black rounded-t-lg grid grid-cols-4 py-3">
        <div className="text-center font-bold">Name</div>
        <div className="text-center font-bold">Date</div>
        <div className="text-center font-bold">Status</div>
        <div className="text-center font-bold">Action</div>
      </div>
      <div className="space-y-3 mt-3">
        {projects.map((project) => (
          <div 
            key={project.name} 
            className="bg-white rounded-lg p-3 grid grid-cols-4 items-center border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="text-center font-semibold">{project.name}</div>
            <div className="text-center">{project.date}</div>
            <div className={`text-center font-semibold ${statusColors[project.status]}`}>
              {project.status}
            </div>
            <div className="flex justify-center gap-4">
              <FaPencilAlt className="text-yellow-500 cursor-pointer hover:text-yellow-600" />
              <FaTrashAlt className="text-red-500 cursor-pointer hover:text-red-600" />
              <FaShareAlt className="text-gray-500 cursor-pointer hover:text-gray-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminProject: React.FC = () => {
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
            <div className="relative w-1/3">
              <input
                type="text"
                placeholder="Search for project"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
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

export default AdminProject;
