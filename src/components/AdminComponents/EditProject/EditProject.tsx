import { useState } from "react";
import { FaPlus } from "react-icons/fa";
// import { Project } from "../../types/Project";
import { Project } from "../../../types/Project";

interface EditProjectProps {
  onClose?: () => void;
  onSave?: (project: Project) => void;
  project?: Project | null;
}

const EditProject: React.FC<EditProjectProps> = ({ onClose, onSave, project }) => {
  // Thêm hàm chuyển đổi từ DD/MM/YYYY sang YYYY-MM-DD
  const convertDateFormat = (dateStr: string) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };

  const [projectData, setProjectData] = useState({
    name: project?.name || "",
    code: project?.code || "",
    date: project?.date ? convertDateFormat(project.date) : "",
    status: project?.status || "Processing"
  });

  const handleSave = () => {
    if (onSave) {
      // Thêm thông báo console để kiểm tra xem onSave có được gọi không
      console.log("Saving project data:", projectData);
      
      // Chuyển đổi ngược lại format DD/MM/YYYY trước khi save
      const formattedDate = projectData.date ? new Date(projectData.date).toLocaleDateString('en-GB') : "";
      onSave({
        ...projectData,
        date: formattedDate
      });
    } else {
      console.error("onSave function is not defined");
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-[500px] max-w-full px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Edit project</h2>

      <div className="flex flex-col items-center gap-y-4">
        <div className="flex flex-col items-center justify-center mb-3">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-3">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="bg-orange-400 text-white px-4 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-orange-500 transition-colors text-sm">
            <FaPlus className="w-3 h-3" /> Add User
          </button>
        </div>

        <div className="w-full space-y-4">
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium text-lg">Project Name</label>
            <input
              type="text"
              value={projectData.name}
              onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-base"
              placeholder="Enter project name"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium text-lg">Project Code</label>
            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-base">
              {projectData.code}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium text-lg">Date</label>
            <input
              type="date"
              value={projectData.date}
              onChange={(e) => setProjectData({ ...projectData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-base"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium text-lg">Status</label>
            <div className="relative">
              <select
                value={projectData.status}
                onChange={(e) => setProjectData({ ...projectData, status: e.target.value as "Processing" | "Pending" | "Complete" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 appearance-none bg-white text-base"
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