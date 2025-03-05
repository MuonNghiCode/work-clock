import { useState } from "react";
import { ProjectInfo } from "../../../types/Project";
import { Modal } from "antd";
import { getEditProject } from "../../../services/projectService";
import { ResponseModel } from "../../../models/ResponseModel";

interface EditProjectProps {
  onClose: () => void;
  project: ProjectInfo;
  users: string[];
  isEditModalOpen: boolean;
}

const EditProject: React.FC<EditProjectProps> = ({ onClose, project, users, isEditModalOpen }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
  };

  // Store original project data
  const [originalProjectData] = useState({
    name: project?.project_name || "",
    code: project?._id || "",
    date: project?.created_at ? formatDate(project.created_at) : "",
    enddate: project?.project_end_date ? formatDate(project.project_end_date) : "",
    status: project?.project_status || "New",
    user: project?.project_members[0]?.user_id || "",
    department: project?.project_department || "",
    descriptions: project?.project_description || ""
  });

  const [projectData, setProjectData] = useState(originalProjectData);

  const handleSave = async () => {
    // Ensure values are properly formatted
    const formattedData = {
      name: projectData.name?.trim() || "",
      code: projectData.code?.trim() || "",
      department: projectData.department?.trim() || "",
      descriptions: projectData.descriptions?.trim() || "",
      date: projectData.date || "",
      enddate: projectData.enddate || "",
      status: projectData.status || "New",
      user: projectData.user || "",
    };
  
    // Validate required fields
    if (!formattedData.name) {
      console.error("Project name is required.");
      return;
    }
    if (!formattedData.code) {
      console.error("Project code is required.");
      return;
    }
    if (!formattedData.department) {
      console.error("Project department is required.");
      return;
    }
  
    // Check if there are changes
    if (JSON.stringify(formattedData) === JSON.stringify(originalProjectData)) {
      console.log("No changes detected. Skipping API call.");
      return;
    }
  
    const data: ProjectInfo = {
      project_name: formattedData.name,
      project_code: formattedData.code,
      project_department: formattedData.department,
      project_description: formattedData.descriptions,
      project_start_date: formattedData.date,
      project_end_date: formattedData.enddate,
      project_status: formattedData.status,
      project_members: [
        {
          user_id: formattedData.user,
          project_role: "Project Manager",
        },
      ],
      created_at: originalProjectData.date, 
      is_deleted: false,
      updated_at: new Date().toISOString(),
      updated_by: "", 
      _id: formattedData.code,
    };
  
    console.log("Data being sent to API:", data);
  
    try {
      const response: ResponseModel<any> = await getEditProject(data, formattedData.code);
  
      console.log("API Response:", response);
  
      if (!response.success) {
        throw new Error(response.message || "Failed to save project");
      }
  
      console.log("Project saved successfully:", response);
      onClose();
    } catch (error) {
      console.error("Error saving project:", error instanceof Error ? error.message : error);
    }
  };
  

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

          <div className="flex flex-row justify-between w-full space-x-4">
            <div className="flex-1 space-y-2 w-full">
              <label className="block text-gray-700 font-medium text-lg">Description</label>
              <input
                type="text"
                value={projectData.descriptions}
                onChange={(e) => setProjectData({ ...projectData, descriptions: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-base"
                placeholder="Enter description"
              />
            </div>

            <div className="flex-1 space-y-2 w-full">
              <label className="block text-gray-700 font-medium text-lg">Status</label>
              <select
                value={projectData.status}
                onChange={(e) => setProjectData({ ...projectData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white text-base"
              >
                <option value="New">New</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
                <option value="Complete">Complete</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditProject;
