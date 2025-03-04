import React, { useEffect, useState } from "react";
import { Button, Pagination, Tag, Input, Modal } from "antd";
import { Project, ProjectInfo } from "../../../types/Project";
import { GetProps } from "antd/lib/_util/type";
import ConfirmModal from "../../ConfirmModal/ConfirmModal";
import Icons from "../../icon";
import EditProject from "../EditProject/EditProject";
import ProjectDetail from "../../ProjectDetail/ProjectDetail";
import { PageInfo, SearchCondition } from "../../../types/ProjectTypes";
import { getAllProject } from "../../../services/projectService";
import AddProject from "../AddProject/AddProject";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

interface TableProjectProps {
  data: Project[];
  totalItems: number;
  loading: boolean;
  onEditProject: (editedProject: Project) => void;
  onDeleteProject: (projectId: string | number) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
}

const TableProject: React.FC = ({
}) => {
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showProjectDetail, setShowProjectDetail] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [totalItems, setTotalItems] = useState<number>(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // const [project, setProject] = useState<ProjectInfo[]>([]);

  
  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status === "All" ? null : status);
    setCurrentPage(1);
  };

  const onSearch: SearchProps["onSearch"] = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setCurrentPage(1);
  };

  const filteredData = projects.filter((item) => {
    const matchesStatus = statusFilter ? item.project_status === statusFilter : true;
    const matchesSearch = item.project_name.toLowerCase().includes(searchValue.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);
  console.log('data', projects)

  const statusTags = ["All", "Processing", "Pending", "Complete"];
  const fetchProjects = async () => {
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
        // const formattedProjects: Project[] = response.data.pageData.map((item: ProjectItem) => ({
        //   key: item._id, // Assuming _id is the unique identifier
        //   name: item.project_name,
        //   date: item.project_start_date,
        //   enddate: item.project_end_date,
        //   department: item.project_department,
        //   status: item.project_status || 'New',
        //   project: item.project_name,
        //   startdate: item.project_start_date,
        // }));
        // setProjects(formattedProjects);
        setProjects(response.data.pageData)
        setTotalItems(response.data.pageInfo.totalItems);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage, pageSize, searchValue]); // Add searchValue to dependencies


  const handleEditProject = (editedProject: ProjectInfo) => {
    const newProjects = projects.map(project =>
      project._id === editedProject._id ? editedProject : project
    );
    setProjects(newProjects);
  };

  const handleDeleteProject = (projectId: string | number) => {
    console.log("Deleting project with id:", projectId);
    // Sử dụng callback để đảm bảo có state mới nhất
    setProjects(prevProjects => {
      console.log("Previous projects:", prevProjects);
      const newProjects = prevProjects.filter(project => project._id !== projectId);
      console.log("New projects:", newProjects);
      return newProjects;
    });
  };

  const handleShowProjectDetail = (project: ProjectInfo) => {
    setSelectedProject(project);
    setShowProjectDetail(true);
  };

  const handleEdit = (project: ProjectInfo) => {
    console.log("Opening edit modal for project:", project);
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };



  const handleDelete = (project: ProjectInfo) => {
    console.log("Deleting project:", project);
    setSelectedProject(project);
    setMessage(`Are you sure you want to delete project "${project.project_name}"?`);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    console.log("Confirming delete for project:", selectedProject);
    if (selectedProject?._id) {
      handleDeleteProject(selectedProject._id);
      setShowConfirmModal(false);
      setSelectedProject(null);
    }
  };

  const handleClose = () => {
    setIsEditModalOpen(false);
    setShowProjectDetail(false);
    setShowConfirmModal(false);
    setIsEditModalOpen(false);
    setSelectedProject(null);
  };

  const handleStatusChangeHTML = (status: string) => {
    switch (status) {
      case "Processing":
        return <span className="text-[#7B2CBF]">Processing</span>;
      case "Pending":
        return <span className="text-[#FF0420]">Pending</span>;
      case "Complete":
        return <span className="text-[#00B087]">Complete</span>;
      default:
        return <span>{status}</span>;
    }
  };
  const handleAddProject = () => {
    // Thêm id cho project mới
    setIsAddModalOpen(true);
  };

  const users = ["dngoc", "haaus", "ntdn"];
  return (
    <>
     <button
              onClick={handleAddProject}
              className="bg-orange-400 text-white px-6 py-3 rounded-full hover:bg-orange-500 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              <span className="text-lg">Add Project</span>
            </button>
            
        <AddProject
          onClose={() => setIsAddModalOpen(false)}
          isAddModalOpen={isAddModalOpen}
        />
      {/* </Modal> */}
      <div className="flex justify-between items-center mb-4">
        <div>
          {statusTags.map((status) => (
            <Tag
              key={status}
              color={
                statusFilter === status ||
                  (status === "All" && statusFilter === null)
                  ? "#ff914d"
                  : "default"
              }
              onClick={() => handleStatusChange(status)}
              className="cursor-pointer !px-2 !py-1 !font-squada !text-lg !rounded-lg"
            >
              {(statusFilter === status ||
                (status === "All" && statusFilter === null)) && (
                  <Icons.Check className="inline-flex" />
                )}{" "}
              {status}
            </Tag>
          ))}
        </div>
        <div className="w-[250px] height-[48px] overflow-hidden rounded-full border-[1px] border-gray-300 bg-white !font-squada">
          <Search
            placeholder="Search project..."
            onSearch={onSearch}
            onChange={handleSearchChange}
            value={searchValue}
            style={{ width: 250 }}
            size="large"
            className="custom-search pl-1"
            variant="borderless"
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
          {/* {console.log(fetchData)} */}
          {currentData.map((item) => (
            <tr
              // onClick={() => handleShowProjectDetail()}
              key={item._id}
              className="h-[70px] bg-white overflow-hidden text-center border-collapse hover:shadow-brand-orange !rounded-2xl cursor-pointer"
            >
              <td className="px-4 py-2 rounded-l-2xl">{item.project_name}</td>
              <td className="px-4 py-2">{item.created_at}</td>
              <td className="px-4 py-2">{item.project_end_date}</td>
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
                    <Button className="!bg-none !border-none">
                      <span className="hover:scale-110">
                        <Icons.Edit
                          color="blue"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                          }}
                          className="w-5 h-5"
                        />
                      </span>
                    </Button>
                  </div>
                  <div className="flex justify-center items-center w-10 h-10 overflow-hidden">
                    <Button className="!bg-none !border-none">
                      <span className="hover:scale-110">
                        <Icons.Delete
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item);
                          }}
                          className="w-5 h-5"
                        />
                      </span>
                    </Button>
                  </div>
                  <div className="flex justify-center items-center w-10 h-10 overflow-hidden">
                    <Button className="!bg-none !border-none">
                      <span className="hover:scale-110">
                        <Icons.Detail
                          color="orange"
                          onClick={() => handleShowProjectDetail(item)}
                          className="w-5 h-5"
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

      <div className="flex justify-end mt-4">
        <Pagination
          className="!font-squada flex justify-end"
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onChange={handlePageChange}
          showSizeChanger
          onShowSizeChange={handlePageChange}
        />
      </div>

      <ProjectDetail
        visible={showProjectDetail}
        onClose={handleClose}
        Project={selectedProject} // Cast selectedProject to Project type
        users={users}
      />
      <ConfirmModal
        visible={showConfirmModal}
        onClose={handleClose}
        message={message}
        onConfirm={handleConfirmDelete}
      />
        {selectedProject && (
          <EditProject
            project={selectedProject}
            onClose={handleClose}
            users={users}
            isEditModalOpen={isEditModalOpen}
          />
        )}
    </>
  );
};

export default TableProject;
