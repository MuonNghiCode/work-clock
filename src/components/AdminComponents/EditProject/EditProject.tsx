import { useState } from "react";

import { Project } from "../../../types/Project";

interface EditProjectProps {
  onClose?: () => void;
  onSave?: (project: Project) => void;
  project?: Project | null;
  users: string[];
}

const EditProject: React.FC<EditProjectProps> = ({ onClose, onSave, project, users }) => {
  const convertDateFormat = (dateStr: string) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  const formatDateToDDMMYYYY = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const [projectData, setProjectData] = useState({
    name: project?.name || "",
    code: project?.code || "",
    date: project?.date ? convertDateFormat(project.date) : "",
    enddate: project?.enddate ? convertDateFormat(project.enddate) : "",
    status: project?.status || "Processing",
    user: project?.user || ""
  });

  const handleSave = () => {
    if (!onSave) {
      console.error("onSave function is not defined");
      return;
    }
    if (!projectData.name.trim() || !projectData.code.trim()) {
      console.error("Project data is incomplete. Please provide a name and code.");
      return;
    }
    onSave({ ...projectData, date: formatDateToDDMMYYYY(projectData.date) });
    onClose?.();
  };

  return (
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
            <label className="block text-gray-700 font-medium text-lg">Status</label>
            <select
              value={projectData.status}
              onChange={(e) => setProjectData({ ...projectData, status: e.target.value as "Processing" | "Pending" | "Complete" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white text-base"
            >
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
              <option value="Complete">Complete</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button 
          className="bg-orange-400 text-white px-6 py-2 rounded-full hover:bg-orange-500 transition-colors text-base"
          onClick={handleSave}
        >
          Save changes
        </button>
      </div>
    </div>
  );
};

export default EditProject;
