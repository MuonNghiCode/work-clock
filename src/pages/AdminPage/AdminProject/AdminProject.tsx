import React, { useState, useEffect } from "react";
import TableProject from "../../../components/AdminComponents/TableProject/TableProject";
import AddProject from "../../../components/AdminComponents/AddProject/AddProject";
import Modal from "../../../components/Modal/Modal";
import { Project } from "../../../types/Project";
import { getAllProject } from "../../../services/projectService"; // Import API
import { PageInfo, SearchCondition } from "../../../types/ProjectTypes";
import { ProjectItem } from "../../../types/ProjectTypes";

const AdminProject: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>(""); // State for search input
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state

  const fetchProjects = async () => {
    setLoading(true); // Start loading
    try {
      const searchCondition: SearchCondition = {
        keyword: searchValue, // Include search keyword
        project_start_date: "",
        project_end_date: "",
        is_delete: false,
        user_id: "",
      };

      const pageInfo: PageInfo = {
        pageNum: currentPage,
        pageSize: pageSize,
        totalItems: 0,
        totalPages: 0,
      };

      const response = await getAllProject(searchCondition, pageInfo);
      if (response.success) {
        const formattedProjects: Project[] = response.data.pageData.map((item: ProjectItem) => ({
          key: item._id, // Assuming _id is the unique identifier
          name: item.project_name,
          date: item.project_start_date,
          enddate: item.project_end_date,
          department: item.project_department,
          status: item.project_status || 'New',
          project: item.project_name,
          startdate: item.project_start_date,
        }));
        setProjects(formattedProjects);
        setTotalItems(response.data.pageInfo.totalItems);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage, pageSize, searchValue]); // Add searchValue to dependencies

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleEditProject = (editedProject: Project) => {
    const newProjects = projects.map(project =>
      project.key === editedProject.key ? editedProject : project
    );
    setProjects(newProjects);
  };

  const handleDeleteProject = (projectId: string | number) => {
    console.log("Deleting project with id:", projectId);
    // Sử dụng callback để đảm bảo có state mới nhất
    setProjects(prevProjects => {
      console.log("Previous projects:", prevProjects);
      const newProjects = prevProjects.filter(project => project.key !== projectId);
      console.log("New projects:", newProjects);
      return newProjects;
    });
  };

  const handleAddProject = (newProject: Project) => {
    // Thêm id cho project mới
    const projectWithId = {
      ...newProject,
      id: Date.now() // Tạo id đơn giản bằng timestamp
    };
    setProjects([...projects, projectWithId]);
    setIsAddModalOpen(false);
  };

  return (
    <>
      <div className="p-6 w-full rounded-lg">
        <div className="w-full flex-col">
          <div className="flex justify-between items-center py-9">
            <h1 className="text-5xl">Project Management</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-orange-400 text-white px-6 py-3 rounded-full hover:bg-orange-500 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              <span className="text-lg">Add Project</span>
            </button>
          </div>

          <TableProject
            data={projects}
            totalItems={totalItems}
            loading={loading}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            searchValue={searchValue} // Pass searchValue to TableProject
            setSearchValue={setSearchValue} // Pass setSearchValue to TableProject
          />
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AddProject
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddProject}
        />
      </Modal>
    </>
  );
};

export default AdminProject;
