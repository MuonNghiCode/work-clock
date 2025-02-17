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

const AdminProjectTitle = "Project Management";
const statusTags = ["All", "Processing", "Pending", "Complete"];

const AdminProject: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      name: "Watermelon",
      code: "4669",
      date: "04/06/2025",
      status: "Processing",
    },
    {
      name: "Mango",
      code: "4670",
      date: "06/09/2025",
      status: "Pending",
    },
    {
      name: "Grape",
      code: "4671",
      date: "27/05/2025",
      status: "Processing",
    },
    {
      name: "Banana",
      code: "4672",
      date: "11/12/2025",
      status: "Pending",
    },
    {
      name: "Melon",
      code: "4673",
      date: "17/12/2025",
      status: "Complete",
    },
    {
      name: "Orange",
      code: "OR001",
      date: "20/12/2025",
      status: "Processing",

    },
    {
      name: "Apple",
      code: "AP001",
      date: "25/12/2025",
      status: "Complete",

    },
    {
      name: "Lemon",
      code: "LM001",
      date: "30/12/2025",
      status: "Pending",

    },
    {
      name: "Kiwi",
      code: "KW001",
      date: "05/01/2026",
      status: "Processing",

    },
    {
      name: "Berry",
      code: "BR001",
      date: "10/01/2026",
      status: "Complete",


    },
    {
      name: "Peach",
      code: "PC001",
      date: "15/01/2026",
      status: "Processing",

    },
    {
      name: "Plum",
      code: "PL001",
      date: "20/01/2026",
      status: "Complete",

    },
    {
      name: "Fig",
      code: "FG001",
      date: "25/01/2026",
      status: "Pending",

    },
    {
      name: "Pear",
      code: "PR001",
      date: "30/01/2026",
      status: "Processing",

    },
    {
      name: "Cherry",
      code: "CH001",
      date: "05/02/2026",
      status: "Complete",

    },
    {
      name: "Lime",
      code: "LI001",
      date: "10/02/2026",
      status: "Pending",

    },
    {
      name: "Papaya",
      code: "PP001",
      date: "15/02/2026",
      status: "Processing",


    },
    {
      name: "Guava",
      code: "GV001",
      date: "20/02/2026",
      status: "Complete",

    },
    {
      name: "Dragon",
      code: "DR001",
      date: "25/02/2026",
      status: "Pending",

    },
    {
      name: "Durian",
      code: "DU001",
      date: "01/03/2026",
      status: "Processing",

    }
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 10;

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

  const handleStatusChange = (status: string) => {
    setStatusFilter(status === "All" ? null : status);
    setCurrentPage(1);
  };

  // Thêm hàm xử lý search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi search
  };

  // Lọc dữ liệu theo status và search
  const filteredProjects = projects
    .filter(project => {
      const projectName = project.name.toLowerCase();
      const projectCode = project.code.toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      
      // Tìm kiếm theo cả name và code
      const matchesSearch = projectName.includes(query) || projectCode.includes(query);
      const matchesStatus = !statusFilter || project.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

  // Tính toán dữ liệu cho trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  const handleSaveEdit = (editedProject: Project) => {
    setProjects(projects.map(project => 
      project.name === selectedProject?.name ? editedProject : project
    ));
    setIsEditModalOpen(false);
  };

  const handleAddProject = (newProject: Project) => {
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    
    const totalPages = Math.ceil(updatedProjects.length / itemsPerPage);
    setCurrentPage(totalPages);
    
    setIsAddModalOpen(false);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Header */}
      <div className="mb-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-8">
            <div className="flex flex-col gap-6">
              {/* Title & Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-black text-[#2B3674] font-['Squada One']">
                    {AdminProjectTitle}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-orange-100 text-orange-600 rounded-full">
                      {projects.length} Projects
                    </span>
                    <span className="px-3 py-1.5 bg-purple-100 text-purple-600 rounded-full">
                      {projects.filter(p => p.status === "Processing").length} Processing
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 
                    text-white rounded-xl transition-all duration-200 shadow-md
                    hover:shadow-lg active:scale-95"
                >
                  <FaPlus className="w-4 h-4" />
                  Add Project
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex items-center justify-between">
                {/* Status Filters */}
                <div className="flex items-center gap-2">
                  {statusTags.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`px-4 py-2 rounded-full transition-all duration-200
                        ${statusFilter === status
                          ? "bg-orange-500 text-white shadow-md transform scale-105"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }
                        flex items-center gap-1.5
                      `}
                    >
                      {statusFilter === status && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      )}
                      {status}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-[300px]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search for project..."
                    className="w-full pl-4 pr-12 py-2 rounded-xl border border-gray-200
                      focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300
                      transition-all duration-200"
                  />
                  <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg">
          <div className="flex items-center">
            <div className="py-1">
              <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <p className="font-bold">Success!</p>
              <p>Project has been added successfully.</p>
            </div>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="container mx-auto px-4">
        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-4 bg-gradient-to-r from-orange-400 to-orange-500">
            <div className="p-10 text-white font-bold text-4xl font-['Squada One']">Name</div>
            <div className="p-10 text-white font-bold text-4xl font-['Squada One']">Date</div>
            <div className="p-10 text-white font-bold text-4xl text-center font-['Squada One']">Status</div>
            <div className="p-10 text-white font-bold text-4xl text-center font-['Squada One']">Action</div>
          </div>

          {/* Table Body */}
          {currentProjects.map((project, index) => (
            <div 
              key={project.name}
              className={`grid grid-cols-4 border-b hover:bg-gray-50/80 transition-all
                ${index === currentProjects.length - 1 ? 'border-b-0' : ''}
              `}
            >
              <div className="p-10 font-semibold text-3xl text-gray-800">{project.name}</div>
              <div className="p-10 text-gray-600 text-3xl">{project.date}</div>
              <div className="p-10 flex justify-center">
                <span className={`px-10 py-4 rounded-full text-2xl font-medium min-w-[200px] text-center
                  ${project.status === 'Processing' ? 'bg-[#F4ECFF] text-[#7B2CBF]' :
                    project.status === 'Pending' ? 'bg-[#FFE2E5] text-[#FF0420]' :
                    'bg-[#E6FAF5] text-[#00B087]'
                  }
                `}>
                  {project.status}
                </span>
              </div>
              <div className="p-10 flex justify-center items-center gap-10">
                <button 
                  onClick={() => handleEdit(project)}
                  className="p-4 text-yellow-500 hover:bg-yellow-50 rounded-xl
                    hover:scale-110 active:scale-95 transition-all duration-200"
                >
                  <FaPencilAlt className="w-8 h-8" />
                </button>
                <button 
                  onClick={() => handleDelete(project)}
                  className="p-4 text-red-500 hover:bg-red-50 rounded-xl
                    hover:scale-110 active:scale-95 transition-all duration-200"
                >
                  <FaTrashAlt className="w-8 h-8" />
                </button>
                <button 
                  onClick={() => handleDetail(project)}
                  className="p-4 text-orange-500 hover:bg-orange-50 rounded-xl
                    hover:scale-110 active:scale-95 transition-all duration-200"
                >
                  <FaEye className="w-8 h-8" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(filteredProjects.length / itemsPerPage) }, (_, index) => (
              <button
                key={index + 1}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-lg
                  ${currentPage === index + 1 ? "bg-orange-400 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}
                `}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AddProject 
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddProject}
        />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <EditProject
          project={selectedProject}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
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