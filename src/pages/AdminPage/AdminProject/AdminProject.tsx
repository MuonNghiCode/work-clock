import React, { useState } from "react";
import TableProject from "../../../components/AdminComponents/TableProject/TableProject";
import { Project } from "../../../types/Project";
import { projectData } from "../../../data/projectData";

const AdminProject: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(projectData);

  const handleEditProject = (editedProject: Project) => {
    const newProjects = projects.map(project => 
      project.id === editedProject.id ? editedProject : project
    );
    setProjects(newProjects);
  };

  const handleDeleteProject = (projectId: string | number) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-full lg:w-3/4 flex-col ">
          <h1 className="text-5xl !py-9">Project Management</h1>
          <TableProject 
            data={projects} 
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
          />
        </div>
      </div>
    </>
  );
};

export default AdminProject;
