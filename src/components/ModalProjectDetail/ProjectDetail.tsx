import React from "react";
import { Modal } from "antd";
import { ProjectInfo } from "../../types/Project";
import ProjectDetailTable from "../ProjectDetailTable/ProjectDetailTable";

interface ProjectDetailProps {
  visible: boolean;
  onClose: () => void;
  project: ProjectInfo | null; // Ensure this matches your project type
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ visible, onClose, project }) => {
  return (
    <Modal width={800} open={visible} onCancel={onClose} footer={null}>
      <h2 className="text-2xl font-bold text-center text-orange-600">Project Detail</h2>
      <ProjectDetailTable project={project} />
    </Modal>
  );
};

export default ProjectDetail;