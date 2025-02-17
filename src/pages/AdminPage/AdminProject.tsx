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
    <div className="p-8 mx-6 my-4">
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

      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{AdminProjectTitle}</h1>

        <div>
          {statusTags.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`mr-3 px-6 py-2 rounded-lg text-lg transition-all
                ${statusFilter === status
                  ? 'bg-orange-400 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }
              `}
            >
              {statusFilter === status && '✓ '}{status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-[250px]">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search for project..."
              className="w-full pl-4 pr-10 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <FaSearch className="text-gray-400 w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-orange-400 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-orange-500 shadow-md"
          >
            <FaPlus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-[95%] mx-auto mt-8">
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl p-10 mb-10">
          <div className="text-white font-bold text-3xl pl-8">Name</div>
          <div className="text-white font-bold text-3xl">Date</div>
          <div className="text-white font-bold text-3xl text-center">Status</div>
          <div className="text-white font-bold text-3xl text-center pr-8">Action</div>
        </div>

        {/* Table Body */}
        {currentProjects.map((project) => (
          <div 
            key={project.name}
            className={`grid grid-cols-4 gap-8 p-10 mb-8 items-center
              bg-white border-2 rounded-2xl
              hover:shadow-xl hover:border-orange-300 hover:-translate-y-1
              transition-all duration-200`}
          >
            <div className="font-semibold text-2xl pl-8">{project.name}</div>
            
            <div className="text-gray-600 text-2xl">{project.date}</div>
            
            <div className="text-center">
              <span className={`inline-block px-10 py-4 rounded-full text-2xl font-medium min-w-[180px]
                ${project.status === 'Processing' ? 'bg-purple-100 text-purple-600' :
                  project.status === 'Pending' ? 'bg-red-100 text-red-600' :
                  'bg-green-100 text-green-600'
                }
                transition-all duration-200 hover:shadow-md`}
              >
                {project.status}
              </span>
            </div>

            <div className="flex justify-center gap-12 pr-8">
              <button 
                onClick={() => handleEdit(project)}
                className="p-5 text-yellow-500 hover:bg-yellow-50 rounded-xl
                  hover:scale-110 active:scale-95 transition-all duration-200"
              >
                <FaPencilAlt className="w-8 h-8" />
              </button>
              <button 
                onClick={() => handleDelete(project)}
                className="p-5 text-red-500 hover:bg-red-50 rounded-xl
                  hover:scale-110 active:scale-95 transition-all duration-200"
              >
                <FaTrashAlt className="w-8 h-8" />
              </button>
              <button 
                onClick={() => handleDetail(project)}
                className="p-5 text-orange-500 hover:bg-orange-50 rounded-xl
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
