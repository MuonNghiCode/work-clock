import React from "react";
import { Modal } from "antd";
import { ProjectInfo } from "../../types/Project";
import ProjectDetailTable from "../ProjectDetailTable/ProjectDetailTable";

interface ProjectDetailProps {
  visible: boolean;
  onClose: () => void;
  project: ProjectInfo | null; // Ensure this matches your project type
  users: string[]; // Add this line to include users
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ visible, onClose, project, users }) => {
  return (
    <Modal width={700} open={visible} onCancel={onClose} footer={null}>
      <h2 className="text-2xl font-bold">Project Detail</h2>
      <ProjectDetailTable project={project} users={users} />
    </Modal>
  );
};

export default ProjectDetail;