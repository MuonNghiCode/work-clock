import React from "react";
import { ProjectInfo } from "../../types/Project";
import { Card, Typography, Table } from "antd";

const { Text } = Typography;

interface ProjectDetailTableProps {
    project: ProjectInfo | null;
}

const ProjectDetailTable: React.FC<ProjectDetailTableProps> = ({ project }) => {
    if (!project) return null; // Return null if no project is selected

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toISOString().split("T")[0]; // YYYY-MM-DD format
    };

    // Data table cho Users & Roles
    const userData = project?.project_members?.map((member, index) => ({
        key: index,
        user: member.user_id,
        role: member.project_role,
    })) || [];

    // Cấu hình cột cho bảng Users & Roles
    const columns = [
        { title: "User", dataIndex: "user", key: "user", className: "text-gray-700 font-medium" },
        { title: "Role", dataIndex: "role", key: "role", className: "text-gray-700 font-medium" },
    ];

    return (
        <Card className="w-full max-w-[800px] mx-auto p-6 shadow-lg rounded-xl border border-gray-200 bg-white">
            <div className="grid grid-cols-2 gap-6">
                {/* Thông tin chung */}
                <div>
                    <Text strong className="text-gray-800">Project Name:</Text>
                    <Text className="block text-gray-600">{project.project_name || "N/A"}</Text>
                </div>
                <div>
                    <Text strong className="text-gray-800">Project Code:</Text>
                    <Text className="block text-gray-600">{project.project_code || "N/A"}</Text>
                </div>
                <div>
                    <Text strong className="text-gray-800">Start Date:</Text>
                    <Text className="block text-gray-600">{formatDate(project.project_start_date)}</Text>
                </div>
                <div>
                    <Text strong className="text-gray-800">End Date:</Text>
                    <Text className="block text-gray-600">{formatDate(project.project_end_date)}</Text>
                </div>
                <div>
                    <Text strong className="text-gray-800">Status:</Text>
                    <Text className="block text-gray-600">{project.project_status || "N/A"}</Text>
                </div>
                <div>
                    <Text strong className="text-gray-800">Department:</Text>
                    <Text className="block text-gray-600">{project.project_department || "N/A"}</Text>
                </div>
            </div>

            {/* Bảng User & Role */}
            <div className="mt-6">
                <Text strong className="text-gray-800 text-lg">Members:</Text>
                <Table 
                    columns={columns} 
                    dataSource={userData} 
                    pagination={false} 
                    className="mt-3 border border-gray-300 rounded-lg shadow-sm"
                />
            </div>

            {/* Mô tả dự án */}
            <div className="mt-6">
                <Text strong className="text-gray-800 text-lg">Description</Text>
                <Text className="block text-gray-600 whitespace-pre-line border border-gray-200 p-4 rounded-md bg-gray-50">
                    {project.project_description || "N/A"}
                </Text>
            </div>
        </Card>
    );
};

export default ProjectDetailTable;
