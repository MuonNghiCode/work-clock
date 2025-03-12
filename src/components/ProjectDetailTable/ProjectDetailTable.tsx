import React, { useEffect, useState } from "react";
import { ProjectInfo } from "../../types/Project";
import { Typography } from "antd";
import { getProjectById } from "../../services/projectService";

const { Text } = Typography;

interface ProjectDetailTableProps {
    projectDetail: ProjectInfo;
    users: string[];
}

const ProjectDetailTable: React.FC<ProjectDetailTableProps> = ({ projectDetail }) => {
    const [project, setProject] = useState<ProjectInfo | null>(null);

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    };

    useEffect(() => {
        const fetchProjectDetail = async () => {
            if(projectDetail._id){    
                const response = await getProjectById(projectDetail._id);
                setProject(response.data);
            }
        };
        fetchProjectDetail();
    }, [projectDetail._id]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg w-full">
            {project && (
                <div className="flex flex-col space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Text className="font-semibold">Project Name:</Text>
                            <Text className="block text-gray-600">{project.project_name || "-"}</Text>
                        </div>
                        <div>
                            <Text className="font-semibold">Project Code:</Text>
                            <Text className="block text-gray-600">{project.project_code || "-"}</Text>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Text className="font-semibold">Start Date:</Text>
                            <Text className="block text-gray-600">{formatDate(project.project_start_date)}</Text>
                        </div>
                        <div>
                            <Text className="font-semibold">End Date:</Text>
                            <Text className="block text-gray-600">{formatDate(project.project_end_date)}</Text>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Text className="font-semibold">Status:</Text>
                            <Text className="block text-gray-600">{project.project_status || "-"}</Text>
                        </div>
                        <div>
                            <Text className="font-semibold">Department:</Text>
                            <Text className="block text-gray-600">{project.project_department || "-"}</Text>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Text className="font-semibold">Users:</Text>
                            {project.project_members?.map((item) => (
                                <Text key={item.user_id} className="block text-gray-600">
                                    {item.user_name || item.full_name || "-"}
                                </Text>
                            ))}
                        </div>
                        <div>
                            <Text className="font-semibold">Roles:</Text>
                            {project.project_members?.map((item) => (
                                <Text key={item.project_role} className="block text-gray-600">
                                    {item.project_role || "-"}
                                </Text>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Text className="font-semibold">Description:</Text>
                        <Text className="block text-gray-600">{project.project_description || "-"}</Text>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetailTable;