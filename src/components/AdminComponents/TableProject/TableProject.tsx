import React, { useCallback, useEffect, useState } from "react";
import { Button, Pagination } from "antd";
import { ProjectInfo } from "../../../types/Project";
import Icons from "../../icon";
// import EditProject from "../EditProject/EditProject";
import ProjectDetail from "../../ModalProjectDetail/ProjectDetail";
import {
  deleteProject,
  getAllProject,
  PageInfo,
  SearchConditionProject,
} from "../../../services/projectService";
import ModalAddProject from "../ModalAddProject/ModalAddProject";
import { debounce } from "lodash";
import DeleteConfirmModal from "../../DeleteConfirmModal/DeleteConfirmModal";
import { toast } from "react-toastify";
import { formatDate } from "../../../utils/formatDate";
import { FileText } from "lucide-react";

const TableProject: React.FC = () => {
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showProjectDetail, setShowProjectDetail] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  // const [message, setMessage] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>();
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState<{
    isOpen: boolean;
    formStatus: "add" | "edit" | undefined;
  }>({ isOpen: false, formStatus: undefined });

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchValue(value);
      fetchProjects(value);
    }, 500),
    []
  );

  const projectDetail = (data: ProjectInfo): ProjectInfo => ({
    _id: data._id,
    project_name: data.project_name,
    project_code: data.project_code,
    project_start_date: data.project_start_date,
    project_end_date: data.project_end_date,
    project_status: data.project_status,
    project_members: data.project_members.map((member) => ({
      user_id: member.user_id,
      project_role: member.project_role,
    })),
    project_department: data.project_department,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    updated_by: "",
    is_deleted: false,
    project_description: data.project_description || "",
  });

  const fetchProjects = async (value: string) => {
    try {
      const searchCondition: SearchConditionProject = {
        keyword: value,
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

      const response = await getAllProject({ searchCondition, pageInfo }, true);
      // console.log("Response:", response.data.pageData);
      if (response.success) {
        const projects = response.data.pageData.map(projectDetail);
        setProjects(projects);
        setTotalItems(response.data.pageInfo.totalItems || 1);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  
  useEffect(() => {
    fetchProjects(searchValue);
    // console.log(projects[0])
  }, [currentPage, pageSize, searchValue]); // Add searchValue to dependencies

  const handleEditProject = (editedProject: ProjectInfo) => {
    setSelectedProject(editedProject);
    setIsAddModalOpen({
      isOpen: true,
      formStatus: "edit",
    });
  };

  const handleShowProjectDetail = (project: ProjectInfo) => {
    setSelectedProject(project);
    setShowProjectDetail(true);
  };

  const handleDelete = (project: ProjectInfo) => {
    setSelectedProject(project);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProject?._id) {
      const response = await deleteProject(selectedProject._id);
      if (response.success) {
        toast.success(`Delete Project ${selectedProject.project_name}`);
      }
      setShowConfirmModal(false);
      setSelectedProject(null);
      fetchProjects(searchValue);
    }
  };

  const handleClose = () => {
    setShowProjectDetail(false);
    setShowConfirmModal(false);
    setIsAddModalOpen({
      isOpen: false,
      formStatus: undefined,
    });
    selectedProject !== null ? setSelectedProject(null) : null;
    fetchProjects(searchValue);
  };

  const handleStatusChangeHTML = (status: string) => {
    switch (status) {
      case "Active":
        return <span className="text-[#00B087]">Active</span>;
      case "Pending":
        return <span className="text-[#FFBF00]">Pending</span>;
      case "Closed":
        return <span className="text-[#FF0420]">Closed</span>;
      default:
        return <span className="text-gray-600">{status}</span>;
    }
  };
  const handleAddProject = () => {
    setIsAddModalOpen({
      isOpen: true,
      formStatus: "add",
    });
  };

  const users = ["dngoc", "haaus", "ntdn"];
  return (
    <>
      <ModalAddProject
        isOpen={isAddModalOpen}
        onClose={handleClose}
        project={selectedProject}
      />
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => handleAddProject()}
          className="bg-[#FFB17A] text-white px-6 py-2 rounded-full hover:bg-[#FF9147] flex items-center gap-2 text-sm"
        >
          <span className="text-xl">+</span>
          <span className="text-lg">Add Project</span>
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by project name..."
            className="w-[300px] px-4 py-2 border rounded-full pr-10"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Icons.SearchIcon
            className="absolute right-3 top-2.5 text-gray-400"
            fontSize={20}
          />
        </div>
      </div>
      <table className="min-w-full !border-separate border-spacing-y-2.5 text-black border-0">
        <thead className="bg-brand-grandient h-[70px] text-lg text-white !rounded-t-lg">
          <tr className="bg-gradient from-[FEB78A] to-[FF914D]">
            <th className="border-white px-4 py-2 !rounded-tl-2xl">
              Project Name
            </th>
            <th className="border-l-2 border-white px-4 py-2">Start Date</th>
            <th className="border-l-2 border-white px-4 py-2">End Date</th>
            <th className="border-l-2 border-white px-4 py-2">Department</th>
            <th className="border-l-2 border-white px-4 py-2">Status</th>
            <th className="border-l-2 border-white px-4 py-2 !rounded-tr-2xl">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="w-full">
          {projects.length === 0 && searchValue ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <FileText size={40} className="text-gray-400 mb-2" />
                  <p className="text-lg">No projects found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              </td>
            </tr>
          ) : projects.map((item) => (
            <tr
              onClick={() => handleShowProjectDetail(item)}
              key={item._id}
              className="h-[70px] bg-white overflow-hidden text-center border-collapse hover:shadow-brand-orange !rounded-2xl cursor-pointer"
            >
              <td className="px-4 py-2 rounded-l-2xl text-[#ff914d] underline">
                {item.project_name}
              </td>
              <td className="px-4 py-2">{formatDate(item.created_at || "")}</td>
              <td className="px-4 py-2">{formatDate(item.project_end_date)}</td>
              <td className="px-4 py-2">{item.project_department}</td>
              <td className="px-4 py-2">
                {handleStatusChangeHTML(item.project_status)}
              </td>
              <td
                className="action px-4 py-2 rounded-r-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-full flex justify-center gap-2 items-center space-x-2">
                  <div className="flex justify-center items-center w-10 h-10 overflow-hidden">
                    <Button className="!bg-transparent !border-none">
                      <span className="hover:scale-110">
                        <Icons.Edit
                          color="blue"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProject(item);
                          }}
                          className="w-5 h-5"
                        />
                      </span>
                    </Button>
                  </div>
                  <div className="flex justify-center items-center w-10 h-10 overflow-hidden">
                    <Button className="!bg-transparent !border-none">
                      <span className="hover:scale-110">
                        <Icons.Detail
                          color="#4CAF50"
                          onClick={() => handleShowProjectDetail(item)}
                          className="w-5 h-5"
                        />
                      </span>
                    </Button>
                  </div>
                  <div className="flex justify-center items-center w-10 h-10 overflow-hidden">
                    <Button className="!bg-transparent !border-none ">
                      <span className="hover:scale-110">
                        <Icons.Delete
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item);
                          }}
                          className="w-5 h-5 bg-transparent"
                        />
                      </span>
                    </Button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {projects.length === 0 ? null  :  (
      <div className="flex justify-end mt-4">
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
          pageSizeOptions={["5", "10", "20", "50"]}
          onShowSizeChange={handlePageChange}
          className="custom-pagination"
          size="small"
          showTotal={() => ""}
        />
      </div>
          )}

      {selectedProject && (
        <ProjectDetail
          visible={showProjectDetail}
          onClose={handleClose}
          project={selectedProject}
          users={users}
        />
      )}
      {selectedProject && (
        <DeleteConfirmModal
          onClose={handleClose}
          onConfirm={handleConfirmDelete}
          project={selectedProject}
          visible={showConfirmModal}
        />
      )}
    </>
  );
};

export default TableProject;
