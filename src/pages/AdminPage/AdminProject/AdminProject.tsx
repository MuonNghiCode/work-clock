import React, { useState } from "react";
import TableProject from "../../../components/AdminComponents/TableProject/TableProject";
import AddProject from "../../../components/AdminComponents/AddProject/AddProject";
import Modal from "../../../components/Modal/Modal";
import { Project } from "../../../types/Project";
import { projectData } from "../../../data/projectData";

const AdminProject: React.FC = () => {
  // Thêm id cho mỗi project khi khởi tạo
  const initialProjects = projectData.map((project, index) => ({
    ...project,
    id: index + 1
  }));

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleEditProject = (editedProject: Project) => {
    const newProjects = projects.map(project =>
      project.id === editedProject.id ? editedProject : project
    );
    setProjects(newProjects);
  };

  const handleDeleteProject = (projectId: string | number) => {
    console.log("Deleting project with id:", projectId);
    // Sử dụng callback để đảm bảo có state mới nhất
    setProjects(prevProjects => {
      console.log("Previous projects:", prevProjects);
      const newProjects = prevProjects.filter(project => project.id !== projectId);
      console.log("New projects:", newProjects);
      return newProjects;
    });
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
      <div className="p-6 w-full rounded-lg ">
        <div className="w-full  flex-col">
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
