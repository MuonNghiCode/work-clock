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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-12 px-8">
        <div className="bg-white rounded-2xl p-12 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">Edit project</h2>

          <div className="grid grid-cols-2 gap-x-24 gap-y-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="block text-gray-700 font-medium text-lg">Project Name</label>
                <input
                  type="text"
                  value={projectData.name}
                  onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                  className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                  placeholder="Enter project name"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-gray-700 font-medium text-lg">Project Code</label>
                <input
                  type="text"
                  value={projectData.code}
                  onChange={(e) => setProjectData({ ...projectData, code: e.target.value })}
                  className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                  placeholder="Enter project code"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-gray-700 font-medium text-lg">Date</label>
                <input
                  type="text"
                  value={projectData.date}
                  onChange={(e) => setProjectData({ ...projectData, date: e.target.value })}
                  className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                  placeholder="DD/MM/YYYY"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-gray-700 font-medium text-lg">Status</label>
                <div className="relative">
                  <select
                    value={projectData.status}
                    onChange={(e) => setProjectData({ ...projectData, status: e.target.value })}
                    className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 appearance-none bg-white"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Pending">Pending</option>
                    <option value="Complete">Complete</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Avatar Section */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-gray-200 overflow-hidden mb-6">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="bg-orange-400 text-white px-8 py-3 text-lg rounded-full flex items-center gap-2 hover:bg-orange-500 transition-colors">
                <FaPlus className="w-5 h-5" /> Add User
              </button>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button 
              className="bg-orange-400 text-white px-12 py-3 text-lg rounded-full hover:bg-orange-500 transition-colors"
              onClick={() => onClose?.()}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
