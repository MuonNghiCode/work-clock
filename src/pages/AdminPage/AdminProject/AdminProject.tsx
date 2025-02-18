import React, { useState } from "react";
import TableProject from "../../../components/AdminComponents/TableProject/TableProject";
import AddProject from "../../../components/AdminComponents/AddProject/AddProject";
import Modal from "../../../components/Modal/Modal";
import { Project } from "../../../types/Project";
import { projectData } from "../../../data/projectData";

const AdminProject: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(projectData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleEditProject = (editedProject: Project) => {
    const newProjects = projects.map(project => 
      project.id === editedProject.id ? editedProject : project
    );
    setProjects(newProjects);
  };

  const handleDeleteProject = (projectId: string | number) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  const handleAddProject = (newProject: Project) => {
    // Thêm id cho project mới
    const projectWithId = {
      ...newProject,
      id: Date.now() // Tạo id đơn giản bằng timestamp
    };
    setProjects([...projects, projectWithId]);
    setIsAddModalOpen(false);
  };

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-full lg:w-3/4 flex-col">
          <div className="flex justify-between items-center py-9">
            <h1 className="text-5xl">Project Management</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-orange-400 text-white px-6 py-3 rounded-full hover:bg-orange-500 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              <span className="text-lg">Add Project</span>
            </button>
          </div>
          
          <TableProject 
            data={projects} 
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
          />
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AddProject
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddProject}
        />
      </Modal>
    </>
  );
};

export default AdminProject;
