import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Project, ProjectInfo } from "../../../types/Project";
import ModalAddUser from "../../AddUserProject/ModalAddUser";
import { Modal } from "antd";

interface AddProjectProps {
  isAddModalOpen: boolean
  onClose?: () => void;
}
const AddProject: React.FC<AddProjectProps> = ({ isAddModalOpen, onClose }) => {

  const [projectData, setProjectData] = useState<ProjectInfo>({
    _id: "",
    project_name: "",
    project_code: "",
    project_start_date: "",
    project_end_date: "",
    project_status: "New",
    project_members: [],
    project_department: "",
    created_at: new Date().toISOString(), // Assuming created_at is a string
    updated_at: new Date().toISOString(), // Assuming updated_at is a string
    updated_by: "",
    is_deleted: false, // Assuming is_deleted is a boolean
    project_description: "", // Assuming project_description is a string
  });

  const handleSubmit = () => {
    console.log('submit')
      onClose;
  };

  const [isOpenModalAddUser, setIsOpenModalAddUser] = useState<boolean>(false);

  const handleOpenModalAddUser = () => {
    setIsOpenModalAddUser(true);
  };

  const handleCloseModalAddUser = () => {
    setIsOpenModalAddUser(false);
  };
  return (
    <Modal open={isAddModalOpen} onCancel={onClose} onOk={handleSubmit} okText='Add Project'>

    <div className="w-[800px] max-w-full px-6 py-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Add Project</h2>

      <div className="flex flex-col items-center gap-y-4">
        <div className="flex flex-row items-center justify-between w-full mb-3">
          <button
            className="bg-orange-400 text-white px-4 py-2 rounded-full flex items-center gap-1.5 hover:bg-orange-500 transition-colors text-sm"
            onClick={handleOpenModalAddUser}
          >
            <FaPlus className="w-3 h-3" /> Add User
          </button>
        </div>

        <div className="flex flex-row justify-between w-full space-x-4">
          <div className="flex-1 space-y-2">
            <label className="block text-gray-700 font-medium text-lg">User</label>
            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-base">
              {projectData.project_members || "No user selected"}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <label className="block text-gray-700 font-medium text-lg">Project Name</label>
            <input
              type="text"
              value={projectData.project_name}
              onChange={(e) => setProjectData({ ...projectData, project_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-base"
              placeholder="Enter project name"
            />
          </div>
        </div>

        <div className="flex flex-row justify-between w-full space-x-4">
          <div className="flex-1 space-y-2">
            <label className="block text-gray-700 font-medium text-lg">Project Code</label>
            <input
              type="text"
              value={projectData.project_code}
              onChange={(e) => setProjectData({ ...projectData, project_code: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-base"
            />
          </div>

          <div className="flex-1 space-y-2">
            <label className="block text-gray-700 font-medium text-lg">Start Date</label>
            <input
              type="date"
              value={projectData.project_start_date}
              onChange={(e) => setProjectData({ ...projectData, project_start_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-base"
            />
          </div>
        </div>

        <div className="flex flex-row justify-between w-full space-x-4">
          <div className="flex-1 space-y-2">
            <label className="block text-gray-700 font-medium text-lg">End Date</label>
            <input
              type="date"
              value={projectData.project_end_date}
              onChange={(e) => setProjectData({ ...projectData, project_end_date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-base"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="block text-gray-700 font-medium text-lg">Department</label>
            <input
              type="text"
              value={projectData.project_department}
              onChange={(e) => setProjectData({ ...projectData, project_department: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-base"
              placeholder="Enter department"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-row justify-between w-full space-x-4">
        <div className="flex-1 space-y-2">
          <label className="block text-gray-700 font-medium text-lg">Status</label>
          <select
            value={projectData.project_status}
            onChange={(e) => setProjectData({ ...projectData, project_status: e.target.value as Project['status'] })}
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 appearance-none bg-white text-base"
          >
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Complete">Complete</option>
          </select>
        </div>
      </div>

      {/* <div className="mt-6 flex justify-center">
        <button
          className="bg-orange-400 text-white px-6 py-2 rounded-full hover:bg-orange-500 transition-colors text-base"
          onClick={handleSubmit}
        >
          Add Project
        </button>
      </div> */}

      <ModalAddUser
        isOpen={isOpenModalAddUser}
        onClose={handleCloseModalAddUser}
      />
    </div>
    </Modal>
  );
};

export default AddProject;