import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Project } from "../../types/Project";

interface EditProjectProps {
  onClose?: () => void;
  onSave?: (project: Project) => void;
  project?: Project | null;
}

const EditProject: React.FC<EditProjectProps> = ({ onClose, onSave, project }) => {
  const [projectData, setProjectData] = useState({
    name: project?.name || "",
    code: project?.code || "",
    date: project?.date || "",
    status: project?.status || "Processing"
  });

  const handleSave = () => {
    if (onSave) {
      onSave(projectData);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-[800px] max-w-full px-10">
      <h2 className="text-5xl font-bold text-gray-800 mb-10 text-center">Edit project</h2>

      <div className="flex flex-col items-center gap-y-10">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-40 h-40 rounded-full bg-gray-200 overflow-hidden mb-6">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="bg-orange-400 text-white px-8 py-3 rounded-full flex items-center gap-2 hover:bg-orange-500 transition-colors text-xl">
            <FaPlus className="w-5 h-5" /> Add User
          </button>
        </div>

        <div className="w-full space-y-10">
          <div className="space-y-4">
            <label className="block text-gray-700 font-medium text-2xl">Project Name</label>
            <input
              type="text"
              value={projectData.name}
              onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
              className="w-full px-8 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-xl"
              placeholder="Enter project name"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-gray-700 font-medium text-2xl">Project Code</label>
            <input
              type="text"
              value={projectData.code}
              onChange={(e) => setProjectData({ ...projectData, code: e.target.value })}
              className="w-full px-8 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-xl"
              placeholder="Enter project code"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-gray-700 font-medium text-2xl">Date</label>
            <input
              type="text"
              value={projectData.date}
              onChange={(e) => setProjectData({ ...projectData, date: e.target.value })}
              className="w-full px-8 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-xl"
              placeholder="DD/MM/YYYY"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-gray-700 font-medium text-2xl">Status</label>
            <div className="relative">
              <select
                value={projectData.status}
                onChange={(e) => setProjectData({ ...projectData, status: e.target.value as "Processing" | "Pending" | "Complete" })}
                className="w-full px-8 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 appearance-none bg-white text-xl"
              >
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
                <option value="Complete">Complete</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <button 
          className="bg-orange-400 text-white px-12 py-5 rounded-full hover:bg-orange-500 transition-colors text-2xl"
          onClick={handleSave}
        >
          Save changes
        </button>
      </div>
    </div>
  );
};

export default EditProject; 