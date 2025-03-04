import { useState } from "react";
import { Project, ProjectInfo } from "../../../types/Project";
import { Modal } from "antd";

interface EditProjectProps {
  onClose: () => void;
  project?: ProjectInfo | null;
  users: string[];
  isEditModalOpen: boolean;
}

const EditProject: React.FC<EditProjectProps> = ({ onClose, project, users, isEditModalOpen }) => {
  const convertDateFormat = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  };

  const formatDateToDDMMYYYY = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}${year}`;
  };


  const [projectData, setProjectData] = useState({
    name: project?.project_name || "",
    code: project?._id || "",
    date: project?.created_at ? project.created_at : "",
    enddate: project?.project_end_date ? project.project_end_date : "",
    status: project?.project_status || "New",
    user: project?.project_members || "",
    department: project?.project_department || ""
  });

  const handleSave = () =>{
    //goi api vo day

    onClose;
  }
 

  return (
  <Modal open={isEditModalOpen} onCancel={onClose} onOk={handleSave} okText='Save'>

    <div className="w-[1000px] max-w-full px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Edit project</h2>
      <div className="flex flex-col items-center gap-y-4">
        <div className="flex flex-row justify-between w-full space-x-4">
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

          <div className="flex-1 space-y-2">
            <label className="block text-gray-700 font-medium text-lg">Project Code</label>
            <input
              type="text"
              value={projectData.code}
              onChange={(e) => setProjectData({ ...projectData, code: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-base"
            />
          </div>
        </div>

        <div className="flex flex-row justify-between w-full space-x-4">
          <div className="flex-1 space-y-2">
            <label className="block text-gray-700 font-medium text-lg">Start Date</label>
            <input
              type="date"
              value={projectData.date}
              onChange={(e) => setProjectData({ ...projectData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-base"
            />
          </div>

          <div className="flex-1 space-y-2">
            <label className="block text-gray-700 font-medium text-lg">End Date</label>
            <input
              type="date"
              value={projectData.enddate}
              onChange={(e) => setProjectData({ ...projectData, enddate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-base"
            />
          </div>
        </div>

        <div className="flex flex-row justify-between w-full space-x-4">
          <div className="flex-1 space-y-2">
            <label className="block text-gray-700 font-medium text-lg">User</label>
            <select
              value={projectData.user}
              onChange={(e) => setProjectData({ ...projectData, user: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white text-base"
            >
              <option value="">Select a user</option>
              {users.map((user, index) => (
                <option key={index} value={user}>{user}</option>
              ))}
            </select>
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
            onChange={(e) => setProjectData({ ...projectData, status: e.target.value as "Processing" | "Pending" | "Complete" })}
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white text-base"
          >
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Complete">Complete</option>
          </select>
        </div>
      </div>
    </div>
  </Modal>
)};


export default EditProject;
