import React from "react";
import { ProjectInfo } from "../../types/Project";
import { Typography } from "antd";

const { Text } = Typography;

interface ProjectDetailTableProps {
    project: ProjectInfo | null;
    users: string[];
}

const ProjectDetailTable: React.FC<ProjectDetailTableProps> = ({ project }) => {
    if (!project) return null; // Return null if no project is selected

    const formatDate = (dateString: string) => {
        if (!dateString) return ""; // Handle empty date string
        const date = new Date(dateString);
        return date.toISOString().split("T")[0]; // Returns date in YYYY-MM-DD format
    };

    return (
            <div className="flex flex-col items-start gap-y-4">
                <div className="flex flex-row justify-between w-full space-x-4">
                    <div className="flex-1 space-y-2">
                        <Text strong>Project Name: </Text>
                        <Text>{project.project_name || ""}</Text>
                    </div>

                    <div className="flex-1 space-y-2">
                        <Text strong>Project Code: </Text>
                        <Text>{project.project_code || ""}</Text>
                    </div>
                </div>

                <div className="flex flex-row justify-between w-full space-x-4">
                    <div className="flex-1 space-y-2">
                        <Text strong>Start Date: </Text>
                        <Text>{formatDate(project.project_start_date) || ""}</Text>
                    </div>

                    <div className="flex-1 space-y-2">
                        <Text strong>End Date: </Text>
                        <Text>{formatDate(project.project_end_date) || ""}</Text>
                    </div>
                </div>

                <div className="flex flex-row justify-between w-full space-x-4">
                    <div className="flex-1 space-y-2">
                        <Text strong>Status: </Text>
                        <Text>{project.project_status || ""}</Text>
                    </div>

                    <div className="flex-1 space-y-2">
                        <Text strong>Department: </Text>
                        <Text>{project.project_department || ""}</Text>
                    </div>
                </div>

                <div className="flex flex-row justify-between w-full space-x-4">
                    <div className="flex-1 space-y-2">
                        <Text strong>User:                   
                        </Text>
                        {project.project_members && project.project_members.map((item) => (
                            <Text key={item.user_id}>{item.user_id}<br /></Text>
                        ))}
                    </div>

                    <div className="flex-1 space-y-2">
                        <Text strong>Role: 
                        </Text>
                        {project.project_members && project.project_members.map((item) => (
                            <Text key={item.project_role}>{item.project_role}<br /></Text>
                        ))}
                    </div>
                </div>

                <div className="flex-1 space-y-2">
                    <Text strong>Description: </Text>
                    <Text>{project.project_description || ""}</Text>
                </div>
            </div>
        
    );
};

export default ProjectDetailTable;