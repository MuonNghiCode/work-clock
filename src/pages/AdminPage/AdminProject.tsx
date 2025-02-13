import { useState } from "react";
import { FaPencilAlt, FaTrashAlt, FaPlus, FaSearch, FaShareAlt } from "react-icons/fa";
// import AdminSidebar from "../Sidebar/AdminSidebar/AdminSidebar";
// import AdminHeader from "../Header/AdminHeader/AdminHeader";
import './AdminProject.css';

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
      <div className="bg-orange-300 grid grid-cols-4 py-3">
        <div className="text-center font-bold">Name</div>
        <div className="text-center font-bold">Date</div>
        <div className="text-center font-bold">Status</div>
        <div className="text-center font-bold">Action</div>
      </div>
      <div className="space-y-3 mt-3">
        {projects.map((project) => (
          <div 
            key={project.name} 
            className="bg-white rounded-lg grid grid-cols-4 items-center py-3"
          >
            <div className="text-center font-medium">{project.name}</div>
            <div className="text-center">{project.date}</div>
            <div className={`text-center font-medium ${statusColors[project.status]}`}>
              {project.status}
            </div>
            <div className="main justify-center space-x-8">
              <FaPencilAlt className="text-yellow-500 w-4 h-4 cursor-pointer" />
              <FaTrashAlt className="text-red-500 w-4 h-4 cursor-pointer" />
              <FaShareAlt className="text-orange-300 w-4 h-4 cursor-pointer" />
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

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 3;
    
    // Always show first page
    buttons.push(
      <button
        key={1}
        className={`w-8 h-8 flex items-center justify-center rounded-lg ${
          currentPage === 1 ? "bg-orange-400 text-white" : "text-gray-600"
        }`}
        onClick={() => setCurrentPage(1)}
      >
        1
      </button>
    );

    if (currentPage > maxVisibleButtons) {
      buttons.push(<span key="dots1" className="px-2">...</span>);
    }

    // Show current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
      if (i <= currentPage + 1) {
        buttons.push(
          <button
            key={i}
            className={`w-8 h-8 flex items-center justify-center rounded-lg ${
              currentPage === i ? "bg-orange-400 text-white" : "text-gray-600"
            }`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      }
    }

    if (currentPage < totalPages - maxVisibleButtons) {
      buttons.push(<span key="dots2" className="px-2">...</span>);
    }

    // Always show last page
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          className={`w-8 h-8 flex items-center justify-center rounded-lg ${
            currentPage === totalPages ? "bg-orange-400 text-white" : "text-gray-600"
          }`}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="p-8 mx-6 my-4">
      <h1 className="text-2xl font-bold mb-6">Project Management</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search for project"
            className="w-full pl-3 pr-10 py-2 border rounded-full"
          />
          <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        
        <button className="bg-orange-400 text-white px-4 py-2 rounded-full flex items-center gap-2">
          <FaPlus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <ProjectTable projects={projects} />

      <div className="flex justify-center items-center mt-8 mb-4 gap-2">
        {renderPaginationButtons()}
      </div>
    </div>
  );
};

export default AdminProject;
