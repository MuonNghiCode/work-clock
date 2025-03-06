import React from "react";
import { Input } from "antd";
import { ProjectInfo } from "../../types/Project";

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
        <div className="w-full max-w-[1000px] px-4">
            <div className="flex flex-col items-start gap-y-4">
                <div className="flex flex-row justify-between w-full space-x-4">
                    <div className="flex-1 space-y-2">
                        <label className="block text-gray-700 font-medium text-lg">Project Name</label>
                        <Input
                            value={project.project_name || ""}
                            className="w-full"
                            readOnly
                        />
                    </div>

                    <div className="flex-1 space-y-2">
                        <label className="block text-gray-700 font-medium text-lg">Project Code</label>
                        <Input
                            value={project.project_code || ""}
                            className="w-full"
                            readOnly
                        />
                    </div>
                </div>

                <div className="flex flex-row justify-between w-full space-x-4">
                    <div className="flex-1 space-y-2">
                        <label className="block text-gray-700 font-medium text-lg">Start Date</label>
                        <Input
                            type="date"
                            value={formatDate(project.project_start_date) || ""}
                            className="w-full"
                            readOnly
                        />
                    </div>

                    <div className="flex-1 space-y-2">
                        <label className="block text-gray-700 font-medium text-lg">End Date</label>
                        <Input
                            type="date"
                            value={formatDate(project.project_end_date) || ""}
                            className="w-full"
                            readOnly
                        />
                    </div>
                </div>

                <div className="flex flex-row justify-between w-full space-x-4">
                    <div className="flex-1 space-y-2">
                        <label className="block text-gray-700 font-medium text-lg">Status</label>
                        <Input
                            value={project.project_status || ""}
                            className="w-full"
                            readOnly
                        />
                    </div>

                    <div className="flex-1 space-y-2">
                        <label className="block text-gray-700 font-medium text-lg">Department</label>
                        <Input
                            value={project.project_department || ""}
                            className="w-full"
                            readOnly
                        />
                    </div>
                </div>

                <div className="flex flex-row justify-between w-full space-x-4">
                <div className="flex-1 space-y-2">
                    <label className="block text-gray-700 font-medium text-lg">User</label>
                        {project.project_members && project.project_members.map((item) => (
                            <span key={item.user_id}>
                                {item.user_id} - {item.project_role}
                                <br />
                            </span>
                        ))}
                                    <label className="block text-gray-700 font-medium text-lg">Description</label>

                    <Input
                        value={project.project_description || ""}
                        className="w-full"
                        readOnly
                    />
                </div>

                </div>
                

                
            </div>
        </div>
    );
};

export default ProjectDetailTable; 