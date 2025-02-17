import { useState } from "react";
import { FaPencilAlt, FaTrashAlt, FaPlus, FaSearch, FaEye } from "react-icons/fa";
import Modal from "../../components/Modal/Modal";
import { Project } from "../../types/Project";
import DeleteConfirmModal from '../../components/DeleteConfirmModal/DeleteConfirmModal';
import ProjectDetailModal from '../../components/ProjectDetailModal/ProjectDetailModal';
import AddProject from "./AddProject";
import EditProject from "./EditProject";
// import AdminSidebar from "../Sidebar/AdminSidebar/AdminSidebar";
// import AdminHeader from "../Header/AdminHeader/AdminHeader";

const statusColors = {
  Processing: "text-green-500",
  Pending: "text-red-500",
  Complete: "text-purple-500",
} as const;

const AdminProject: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    { name: "Watermelon", code: "4669", date: "04/06/2025", status: "Processing" },
    { name: "Mango", code: "4670", date: "06/09/2025", status: "Pending" },
    { name: "Grape", code: "4671", date: "27/05/2025", status: "Processing" },
    { name: "Banana", code: "4672", date: "11/12/2025", status: "Pending" },
    { name: "Melon", code: "4673", date: "17/12/2025", status: "Complete" },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
    if (selectedProject) {
      setProjects(projects.filter(project => project.name !== selectedProject.name));
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="p-8 mx-6 my-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Management</h1>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for project..."
              className="w-80 pl-4 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <FaSearch className="text-gray-400 w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-orange-400 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-orange-500"
          >
            <FaPlus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex gap-2 mb-6">
        <button 
          className={`w-8 h-8 flex items-center justify-center rounded-lg ${
            currentPage === 1 ? "bg-orange-400 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>
        <button 
          className={`w-8 h-8 flex items-center justify-center rounded-lg ${
            currentPage === 2 ? "bg-orange-400 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => setCurrentPage(2)}
        >
          2
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-4 bg-orange-300 py-3 px-6">
          <div className="text-left font-bold">Project Name</div>
          <div className="text-left font-bold">Date</div>
          <div className="text-left font-bold">Status</div>
          <div className="text-center font-bold">Action</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {projects.map((project) => (
            <div key={project.name} className="grid grid-cols-4 items-center py-4 px-6 hover:bg-gray-50">
              <div className="font-medium">{project.name}</div>
              <div className="text-gray-600">{project.date}</div>
              <div>
                <span className={`${statusColors[project.status]} font-medium`}>
                  {project.status}
                </span>
              </div>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => handleEdit(project)}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <FaPencilAlt className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(project)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrashAlt className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDetail(project)}
                  className="text-orange-500 hover:text-orange-600"
                >
                  <FaEye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AddProject onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <EditProject 
          project={selectedProject} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <DeleteConfirmModal 
          project={selectedProject!}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </Modal>

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
