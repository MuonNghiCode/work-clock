import { useState } from "react";
import AddProject from "./AddProject";
import EditProject from "./EditProject";
import { FaPencilAlt, FaTrashAlt, FaPlus, FaSearch, FaEye } from "react-icons/fa";
import Modal from "../../components/Modal/Modal";
import { Project } from "../../types/Project";
import DeleteConfirmModal from '../../components/DeleteConfirmModal/DeleteConfirmModal';
import ProjectDetailModal from '../../components/ProjectDetailModal/ProjectDetailModal';
// import AdminSidebar from "../Sidebar/AdminSidebar/AdminSidebar";
// import AdminHeader from "../Header/AdminHeader/AdminHeader";

const projects: Project[] = [
  { name: "Watermelon", code: "4669", date: "04/06/2025", status: "Processing" },
  { name: "Mango", code: "4670", date: "06/09/2025", status: "Pending" },
  { name: "Grape", code: "4671", date: "27/05/2025", status: "Processing" },
  { name: "Banana", code: "4672", date: "11/12/2025", status: "Pending" },
  { name: "Melon", code: "4673", date: "17/12/2025", status: "Complete" },
];

const statusColors = {
  Processing: "text-green-500",
  Pending: "text-red-500",
  Complete: "text-purple-500",
} as const;

interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onDetail: (project: Project) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects, onEdit, onDelete, onDetail }) => {
  return (
    <div className="w-full">
      <div className="bg-orange-300 grid grid-cols-4 py-4 px-6 rounded-t-lg">
        <div className="text-center font-bold text-gray-800">Name</div>
        <div className="text-center font-bold text-gray-800">Date</div>
        <div className="text-center font-bold text-gray-800">Status</div>
        <div className="text-center font-bold text-gray-800">Action</div>
      </div>
      <div className="space-y-4 p-4">
        {projects.map((project) => (
          <div 
            key={project.name} 
            className="bg-white rounded-lg grid grid-cols-4 items-center py-4 px-6 hover:shadow-md transition-shadow"
          >
            <div className="text-center font-medium text-gray-700">{project.name}</div>
            <div className="text-center text-gray-600">{project.date}</div>
            <div className="text-center">
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                statusColors[project.status].replace('text-', 'bg-').replace('500', '100')
              }`}>
                {project.status}
              </span>
            </div>
            <div className="flex justify-center items-center gap-4">
              <button 
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-yellow-600 bg-yellow-50 hover:bg-yellow-100 transition-colors"
                onClick={() => onEdit(project)}
              >
                <FaPencilAlt className="w-3.5 h-3.5" />
                Edit
              </button>
              <button 
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                onClick={() => onDelete(project)}
              >
                <FaTrashAlt className="w-3.5 h-3.5" />
                Delete
              </button>
              <button 
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors"
                onClick={() => onDetail(project)}
              >
                <FaEye className="w-3.5 h-3.5" />
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminProject: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const totalPages = 68;


  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleDetail = (project: Project) => {
    setSelectedProject(project);
    setIsDetailModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Add delete logic here
    console.log('Deleting project:', selectedProject?.name);
    setIsDeleteModalOpen(false);
  };

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
        
        <button 
          className="bg-orange-400 text-white px-4 py-2 rounded-full flex items-center gap-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FaPlus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <ProjectTable 
        projects={projects} 
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetail={handleDetail}
      />

      <div className="flex justify-center items-center mt-8 mb-4 gap-2">
        {renderPaginationButtons()}
      </div>

      {/* Add Project Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AddProject onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* Edit Project Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <EditProject 
          project={selectedProject} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      </Modal>

      {/* Delete Project Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <DeleteConfirmModal 
          project={selectedProject!}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </Modal>

      {/* Project Detail Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}>
        <ProjectDetailModal
          project={selectedProject!}
          onClose={() => setIsDetailModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default AdminProject;
