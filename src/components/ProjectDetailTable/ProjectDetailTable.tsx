import React, { useEffect, useState } from "react";
import { ProjectInfo } from "../../types/Project";
import { Modal } from "antd";
import { getProjectById } from "../../services/projectService";

interface ProjectDetailTableProps {
    projectDetail: ProjectInfo;
    users: string[];
    visible: boolean;
    onClose: () => void;
}

const ProjectDetailTable: React.FC<ProjectDetailTableProps> = ({ projectDetail, visible, onClose }) => {
    const [project, setProject] = useState<ProjectInfo | null>(null);

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    };

    useEffect(() => {
        const fetchProjectDetail = async () => {
            if (projectDetail._id) {    
                const response = await getProjectById(projectDetail._id);
                console.log(response.data);
                setProject(response.data);
            }
        };
        fetchProjectDetail();
    }, [projectDetail._id]);

    return (
        <Modal
          title={<h4 className="text-2xl font-semibold text-[#FF9447] mb-4 border-b pb-2">
            Project Detail : {project?.project_name || '-'}</h4>}
          open={visible}
          cancelButtonProps={{ hidden: true }}
          onOk={onClose}
          onCancel={onClose}
          className="flex items-center justify-center"
          style={{ minWidth: "40%", maxWidth: "80%", fontFamily: "Squada One" }}
          styles={{ content: { backgroundColor: '#FAFAFA' }, footer: { backgroundColor: '#FAFAFA' }, header: { backgroundColor: '#FAFAFA' } }}
        >
          <div className="font-squada flex-col bg-white p-8 -m-2 my-2 rounded-2xl shadow-md">
            <div className="flex-col space-y-4">
              <div className="flex items-center">
                <span className="w-1/2 font-medium text-gray-600 text-lg">Project Name: </span>
                <span className="w-1/2 text-gray-800 truncate text-lg">{project?.project_name || '-'}</span>
              </div>
              <div className="flex items-center">
                <span className="w-1/2 font-medium text-gray-600 text-lg">Project Code:</span>
                <span className="w-1/2 text-gray-800 truncate text-lg"> {project?.project_code || '-'}</span>
              </div>
              <div className="flex items-center">
                <span className="w-1/2 font-medium text-gray-600 text-lg">Start Date:</span>
                <span className="w-1/2 text-gray-800 truncate text-lg"> {formatDate(project?.project_start_date || "")}</span>
              </div>
              <div className="flex items-center">
                <span className="w-1/2 font-medium text-gray-600 text-lg">End Date:</span>
                <span className="w-1/2 text-gray-800 truncate text-lg"> {formatDate(project?.project_end_date || "")}</span>
              </div>
              <div className="flex items-center">
                <span className="w-1/2 font-medium text-gray-600 text-lg">Department:</span>
                <span className="w-1/2 text-gray-800 truncate text-lg">{project?.project_department || '-'}</span>
              </div>
              <div className="flex items-center pb-2">
                <span className="w-1/2 font-medium text-gray-600 text-lg">Status:</span>
                <span className="w-1/2 text-gray-800 truncate text-lg">{project?.project_status || '-'}</span>
              </div>
              <div className="flex-col mt-4 w-full">
                <h4 className="font-semibold text-xl !text-gradient-color mb-4 border-t pt-4 text-[#FF9447]">Users & Roles:</h4>
                <table className="min-w-full divide-y divide-[#FF9447] border border-[#FF9447] w-fit">
                  <thead className="bg-gray-50 rounded-t-lg">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {project?.project_members?.map((member) => (
                      <tr key={member.user_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{member.user_name || member.full_name || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{member.project_role || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h4 className="font-semibold text-xl !text-gradient-color mb-4 border-t pt-4 text-[#FF9447]">Description:</h4>
                <span className="block text-gray-600">{project?.project_description || '-'}</span>
              </div>
            </div>
          </div>
        </Modal>
    );
};

export default ProjectDetailTable;