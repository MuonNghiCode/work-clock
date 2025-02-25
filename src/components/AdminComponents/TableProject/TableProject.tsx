import React, { useState } from "react";
import { Button, Pagination, Tag, Input } from "antd";
import { Project } from "../../../types/Project";
import { GetProps } from "antd/lib/_util/type";
import ConfirmModal from "../../ConfirmModal/ConfirmModal";
import Icons from "../../icon";
import EditProject from "../EditProject/EditProject";
import Modal from "../../Modal/Modal";
import ProjectDetail from "../../ProjectDetail/ProjectDetail";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

interface DataProps {
  data: Project[];
  onEditProject: (editedProject: Project) => void;
  onDeleteProject: (projectId: string | number) => void;
}

const TableProject: React.FC<DataProps> = ({
  data,
  onEditProject,
  onDeleteProject,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [showProjectDetail, setShowProjectDetail] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const filteredData = data.filter((item) => {
    const matchesStatus = statusFilter ? item.status === statusFilter : true;

    const matchesSearch = searchValue
      ? searchValue
          .toLowerCase()
          .split("")
          .every((char) => {
            const charCount = searchValue.toLowerCase().split(char).length - 1;
            const nameCharCount =
              item.name.toLowerCase().split(char).length - 1;
            return nameCharCount >= charCount;
          })
      : true;

    return matchesStatus && matchesSearch;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  const statusTags = ["All", "Processing", "Pending", "Complete"];

  const handleShowProjectDetail = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetail(true);
  };

  const handleEdit = (project: Project) => {
    console.log("Opening edit modal for project:", project);
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (editedProject: Project) => {
    onEditProject(editedProject);
    setIsEditModalOpen(false);
    setSelectedProject(null);
  };

  const handleDelete = (project: Project) => {
    console.log("Deleting project:", project);
    setSelectedProject(project);
    setMessage(`Are you sure you want to delete project "${project.name}"?`);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    console.log("Confirming delete for project:", selectedProject);
    if (selectedProject?.id) {
      onDeleteProject(selectedProject.id);
      setShowConfirmModal(false);
      setSelectedProject(null);
    }
  };

  const handleClose = () => {
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


  const users = ["dngoc", "haaus", "ntdn"]; 
  return (
    <>
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
            <th className="border-l-2 border-white px-4 py-2">Status</th>
            <th className="border-l-2 border-white px-4 py-2 !rounded-tr-2xl">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="w-full">
          {currentData.map((item, index) => (
            <tr
              onClick={() => handleShowProjectDetail(item)}
              key={index}
              className="h-[70px] bg-white overflow-hidden text-center border-collapse hover:shadow-brand-orange !rounded-2xl cursor-pointer"
            >
              <td className="px-4 py-2 rounded-l-2xl">{item.name}</td>
              <td className="px-4 py-2">{item.date}</td>
              <td className="px-4 py-2">{item.enddate}</td>
              <td className="px-4 py-2">
                {handleStatusChangeHTML(item.status)}
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
          total={filteredData.length}
          onChange={handlePageChange}
          showSizeChanger
          onShowSizeChange={handlePageChange}
        />
      </div>

      <ProjectDetail
        visible={showProjectDetail}
        onClose={handleClose}
        Project={selectedProject}
        users={users}
      />
      <ConfirmModal
        visible={showConfirmModal}
        onClose={handleClose}
        message={message}
        onConfirm={handleConfirmDelete}
      />
      <Modal isOpen={isEditModalOpen} onClose={handleClose}>
        {selectedProject && (
          <EditProject
            project={selectedProject}
            onClose={handleClose}
            onSave={handleSaveEdit}
            users={users}
          />
        )}
      </Modal>
    </>
  );
};

export default TableProject;
