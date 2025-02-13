import { useState } from "react";
import { FaPencilAlt, FaTrashAlt, FaPlus, FaSearch, FaShareAlt } from "react-icons/fa";
// import AdminSidebar from "../Sidebar/AdminSidebar/AdminSidebar";
// import AdminHeader from "../Header/AdminHeader/AdminHeader";

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
  Processing: "text-green-500 bg-green-50",
  Pending: "text-red-500 bg-red-50",
  Complete: "text-purple-500 bg-purple-50",
} as const;

interface ProjectTableProps {
  projects: Project[];
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden flex-1">
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white grid grid-cols-4 py-4">
        <div className="text-center font-semibold">Name</div>
        <div className="text-center font-semibold">Date</div>
        <div className="text-center font-semibold">Status</div>
        <div className="text-center font-semibold">Action</div>
      </div>
      <div className="min-h-[calc(100vh-300px)] flex flex-col">
        {projects.map((project) => (
          <div 
            key={project.name} 
            className="grid grid-cols-4 items-center border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="p-4 text-center font-medium text-gray-800">{project.name}</div>
            <div className="p-4 text-center text-gray-600">{project.date}</div>
            <div className="p-4 flex justify-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[project.status]}`}>
                {project.status}
              </span>
            </div>
            <div className="p-4 flex justify-center space-x-4">
              <button className="p-1.5 rounded-lg hover:bg-yellow-50 transition-colors">
                <FaPencilAlt className="text-yellow-500 w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                <FaTrashAlt className="text-red-500 w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <FaShareAlt className="text-gray-400 w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        <div className="flex-grow"></div>
      </div>
    </div>
  );
};

const AdminProject: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 68;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
        <p className="text-gray-600 mt-1">Manage and track your projects</p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search for project"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:border-orange-400 transition-all"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        
        <button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow">
          <FaPlus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <ProjectTable projects={projects} />
      </div>

      <div className="flex justify-center items-center py-4 gap-1 mt-auto">
        <button
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
            currentPage === 1 
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-sm" 
              : "bg-white text-gray-600 border border-gray-200 hover:border-orange-400 hover:text-orange-500"
          }`}
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>
        {currentPage > 3 && <span className="px-2 text-gray-400">...</span>}
        {[currentPage - 1, currentPage, currentPage + 1]
          .filter((page) => page > 1 && page < totalPages)
          .map((page) => (
            <button
              key={page}
              className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
                currentPage === page 
                  ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-sm" 
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-400 hover:text-orange-500"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        {currentPage < totalPages - 2 && <span className="px-2 text-gray-400">...</span>}
        <button
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
            currentPage === totalPages 
              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-sm" 
              : "bg-white text-gray-600 border border-gray-200 hover:border-orange-400 hover:text-orange-500"
          }`}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </button>
      </div>
    </div>
  );
};

export default AdminProject;
