import { useState } from "react";
import { ProjectInfo } from "../../../types/Project";
import { Modal } from "antd";
import { getEditProject } from "../../../services/projectService";
import { ResponseModel } from "../../../models/ResponseModel";
import { toast } from "react-toastify";
import { formatDate } from "../../../utils/formatDate";

interface EditProjectProps {
  onClose: () => void;
  project: ProjectInfo;
  users: string[];
  isEditModalOpen: boolean;
}

const EditProject: React.FC<EditProjectProps> = ({
  onClose,
  project,
  users,
  isEditModalOpen,
}) => {

  // Store original project data
  const [originalProjectData] = useState({
    id: project?._id || "",
    name: project?.project_name || "",
    code: project?.project_code || "",
    date: project?.created_at ? formatDate(new Date(project.created_at)) : "",
    enddate: project?.project_end_date
      ? formatDate(new Date(project.project_end_date))
      : "",
    status: project?.project_status || "New",
    user: project?.project_members[0]?.user_name || "",
    department: project?.project_department || "",
    descriptions: project?.project_description || "",
    role: project?.project_members[0]?.project_role || ""
  });

  const [projectData, setProjectData] = useState(originalProjectData);

  const handleSave = async () => {
    const formattedData = {
      id: projectData.id,
      name: projectData.name?.trim() || "",
      code: projectData.code?.trim() || "",
      department: projectData.department?.trim() || "",
      descriptions: projectData.descriptions?.trim() || "",
      date: projectData.date || "",
      enddate: projectData.enddate || "",
      status: projectData.status || "New",
      user: projectData.user || "",
      role: projectData.role || ""
    };

    if (!formattedData.name || !formattedData.code || !formattedData.department) {
      console.error("All fields are required.");
      return;
    }

    if (JSON.stringify(formattedData) === JSON.stringify(originalProjectData)) {
      console.log("No changes detected. Skipping API call.");
      return;
    }

    const data: ProjectInfo = {
      project_name: formattedData.name,
      project_code: formattedData.code,
      project_department: formattedData.department,
      project_description: formattedData.descriptions,
      project_start_date: formattedData.date
        ? new Date(formattedData.date).toISOString()
        : "",
      project_end_date: formattedData.enddate
        ? new Date(formattedData.enddate).toISOString()
        : "",
      project_status: formattedData.status,
      project_members: [
        {
          user_id: formattedData.user,
          project_role: formattedData.role,
        },
      ],
      updated_by: "",
      is_deleted: false,
      _id: formattedData.id,
    };

    try {
      const response: ResponseModel<any> = await getEditProject(
        data,
        formattedData.id
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to save project");
      }

      toast.success("Project saved successfully");
      onClose();
    } catch (error) {
      console.error("Error saving project:", error instanceof Error ? error.message : error);
    }
  };

  return (
    <Modal
      open={isEditModalOpen}
      onCancel={onClose}
      onOk={handleSave}
      okText="Save"
      width={800}
    >
      <div className="w-full px-6 py-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Edit Project
        </h2>
        <div className="flex flex-col items-center gap-y-6">
          <div className="flex flex-row justify-between w-full space-x-4">
            <div className="flex-1 space-y-2">
              <label className="block text-gray-700 font-medium text-lg">
                Project Name
              </label>
              <input
                type="text"
                value={projectData.name}
                onChange={(e) =>
                  setProjectData({ ...projectData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-xl"
                placeholder="Enter project name"
              />
            </div>

            <div className="flex-1 space-y-2">
              <label className="block text-gray-700 font-medium text-lg">
                Project Code
              </label>
              <input
                type="text"
                value={projectData.code}
                onChange={(e) =>
                  setProjectData({ ...projectData, code: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-xl"
              />
            </div>
          </div>

          <div className="flex flex-row justify-between w-full space-x-4">
            <div className="flex-1 space-y-2">
              <label className="block text-gray-700 font-medium text-lg">
                Start Date
              </label>
              <input
                type="date"
                value={projectData.date}
                onChange={(e) =>
                  setProjectData({ ...projectData, date: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-xl"
              />
            </div>

            <div className="flex-1 space-y-2">
              <label className="block text-gray-700 font-medium text-lg">
                End Date
              </label>
              <input
                type="date"
                value={projectData.enddate}
                onChange={(e) =>
                  setProjectData({ ...projectData, enddate: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-xl"
              />
            </div>
          </div>

          <div className="flex flex-row justify-between w-full space-x-4">
            <div className="flex-1 space-y-2">
              <label className="block text-gray-700 font-medium text-lg">
                User
              </label>
              <select
                value={projectData.user}
                onChange={(e) =>
                  setProjectData({ ...projectData, user: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white text-xl"
              >
                <option value="">Select a user</option>
                {users.map((user, index) => (
                  <option key={index} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 space-y-2">
              <label className="block text-gray-700 font-medium text-lg">
                Role
              </label>
              <input
                type="text"
                value={projectData.role}
                onChange={(e) =>
                  setProjectData({ ...projectData, role: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-xl"
                placeholder="Enter role"
              />
            </div>
          </div>

          <div className="flex-1 space-y-2 w-full">
            <label className="block text-gray-700 font-medium text-lg">
              Department
            </label>
            <input
              type="text"
              value={projectData.department}
              onChange={(e) =>
                setProjectData({
                  ...projectData,
                  department: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-xl"
              placeholder="Enter department"
            />
          </div>

          <div className="flex-1 space-y-2 w-full">
            <label className="block text-gray-700 font-medium text-lg">
              Status
            </label>
            <select
              value={projectData.status}
              onChange={(e) =>
                setProjectData({ ...projectData, status: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white text-xl"
            >
              <option value="New">New</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex-1 space-y-2 w-full">
            <label className="block text-gray-700 font-medium text-lg">
              Descriptions
            </label>
            <textarea
              rows={3}
              value={projectData.descriptions}
              onChange={(e) =>
                setProjectData({
                  ...projectData,
                  descriptions: e.target.value,
                })
              }
              className="w-full px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 text-xl"
              placeholder="Enter description"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditProject;