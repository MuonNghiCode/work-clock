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
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Edit project</h2>

      <div className="grid grid-cols-2 gap-x-24 gap-y-8">
        {/* Left Column - Form Fields */}
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="block text-gray-700 font-medium">Project Name</label>
            <input
              type="text"
              value={projectData.name}
              onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
              placeholder="Enter project name"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-gray-700 font-medium">Project Code</label>
            <input
              type="text"
              value={projectData.code}
              onChange={(e) => setProjectData({ ...projectData, code: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
              placeholder="Enter project code"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-gray-700 font-medium">Date</label>
            <input
              type="text"
              value={projectData.date}
              onChange={(e) => setProjectData({ ...projectData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
              placeholder="DD/MM/YYYY"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-gray-700 font-medium">Status</label>
            <div className="relative">
              <select
                value={projectData.status}
                onChange={(e) => setProjectData({ ...projectData, status: e.target.value as "Processing" | "Pending" | "Complete" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 appearance-none bg-white"
              >
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
                <option value="Complete">Complete</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Avatar Section */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-4">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="bg-orange-400 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-orange-500 transition-colors">
            <FaPlus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button 
          className="bg-orange-400 text-white px-8 py-2 rounded-full hover:bg-orange-500 transition-colors"
          onClick={handleSave}
        >
          Save changes
        </button>
      </div>
    </div>
  );
};

export default EditProject; 