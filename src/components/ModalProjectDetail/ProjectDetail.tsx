import React from "react";
import { ProjectInfo } from "../../types/Project";
import ProjectDetailTable from "../ProjectDetailTable/ProjectDetailTable";

interface ProjectDetailProps {
    visible: boolean;
    onClose: () => void;
    project: ProjectInfo;
    users: string[];
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ visible, onClose, project, users }) => {
    return <ProjectDetailTable projectDetail={project} users={users} visible={visible} onClose={onClose} />;
};

export default ProjectDetail;