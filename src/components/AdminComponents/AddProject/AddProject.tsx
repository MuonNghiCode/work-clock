import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Project } from "../../../types/Project";
import ModalAddUser from "../../AddUserProject/ModalAddUser";

interface AddProjectProps {
  onClose?: () => void;
  onAdd?: (project: Project) => void;
}

const AddProject: React.FC<AddProjectProps> = ({ onClose, onAdd }) => {
  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 8;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const [projectData, setProjectData] = useState<Project>({
    name: "",
    code: generateRandomCode(),
    date: "",
    enddate: "",
    status: "Processing",
    user: "",
    department: "",
  });

  const [isOpenModalAddUser, setIsOpenModalAddUser] = useState(false);

  const handleSubmit = () => {
    if (onAdd) {
      onAdd(projectData);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleOpenModalAddUser = () => {
    setIsOpenModalAddUser(true);
  };

  const handleCloseModalAddUser = () => {
    setIsOpenModalAddUser(false);
  };

  return (
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
              {projectData.user || "No user selected"}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <label className="block text-gray-700 font-medium text-lg">Project Name</label>
            <input
              type="text"
              value={projectData.name}
              onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
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
              value={projectData.code}
              onChange={(e) => setProjectData({ ...projectData, code: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-base"
            />
          </div>

          <div className="flex-1 space-y-2">
            <label className="block text-gray-700 font-medium text-lg">Start Date</label>
            <input
              type="date"
              value={projectData.date}
              onChange={(e) => setProjectData({ ...projectData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-base"
            />
          </div>
        </div>

        <div className="flex flex-row justify-between w-full space-x-4">
          <div className="flex-1 space-y-2">
            <label className="block text-gray-700 font-medium text-lg">End Date</label>
            <input
              type="date"
              value={projectData.enddate}
              onChange={(e) => setProjectData({ ...projectData, enddate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-base"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="block text-gray-700 font-medium text-lg">Department</label>
            <input
              type="text"
              value={projectData.department}
              onChange={(e) => setProjectData({ ...projectData, department: e.target.value })}
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
            value={projectData.status}
            onChange={(e) => setProjectData({ ...projectData, status: e.target.value as Project['status'] })}
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 appearance-none bg-white text-base"
          >
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Complete">Complete</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          className="bg-orange-400 text-white px-6 py-2 rounded-full hover:bg-orange-500 transition-colors text-base"
          onClick={handleSubmit}
        >
          Add Project
        </button>
      </div>

      <ModalAddUser
        isOpen={isOpenModalAddUser}
        onClose={handleCloseModalAddUser}
      />
    </div>
  );
};

export default AddProject;