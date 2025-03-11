import React from "react";
import { Modal } from "antd";
import { ProjectInfo } from "../../types/Project";
import ProjectDetailTable from "../ProjectDetailTable/ProjectDetailTable";

interface ProjectDetailProps {
    visible: boolean;
    onClose: () => void;
    project: ProjectInfo;
    users: string[];
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ visible, onClose, project, users }) => {
    return (
        <Modal
            width={700}
            open={visible}
            onCancel={onClose}
            footer={null}
            className="rounded-xl shadow-xl"
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Detail</h2>
            <ProjectDetailTable projectDetail={project} users={users} />
        </Modal>
    );
};

export default ProjectDetail;