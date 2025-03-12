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
            open={visible}
            onCancel={onClose}
            footer={null}
        >

            <ProjectDetailTable projectDetail={project} users={users} visible={visible} onClose={onClose} />

        </Modal>
    );
};

export default ProjectDetail;