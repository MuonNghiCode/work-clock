import { useState } from "react";
import { FaPlus } from "react-icons/fa";

interface EditProjectProps {
  onClose?: () => void;
}

const EditProject: React.FC<EditProjectProps> = ({ onClose }) => {
  const [projectData, setProjectData] = useState({
    name: "Watermelon",
    code: "4669",
    date: "04/06/2025",
    status: "Processing"
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-8">Edit project</h2>

        <div className="grid grid-cols-2 gap-x-16 gap-y-6">
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Project Name</label>
            <input
              type="text"
              value={projectData.name}
              onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div className="row-span-3 flex flex-col items-center justify-center">
            <img
              src="/path/to/avatar.jpg"
              alt="User Avatar"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <button className="bg-orange-400 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-orange-500 transition-colors">
              <FaPlus className="w-4 h-4" /> Add User
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Project Code</label>
            <input
              type="text"
              value={projectData.code}
              onChange={(e) => setProjectData({ ...projectData, code: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Date</label>
            <input
              type="text"
              value={projectData.date}
              onChange={(e) => setProjectData({ ...projectData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Status</label>
            <div className="relative">
              <input
                type="text"
                value={projectData.status}
                onChange={(e) => setProjectData({ ...projectData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button 
            className="bg-orange-400 text-white px-8 py-2.5 rounded-full hover:bg-orange-500 transition-colors"
            onClick={() => onClose?.()}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
