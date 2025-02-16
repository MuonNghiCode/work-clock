import React from 'react';
import { Project } from '../../types/Project';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Project Details</h2>

      <div className="grid grid-cols-2 gap-x-24 gap-y-8">
        {/* Left Column - Project Info */}
        <div className="space-y-6">
          <div>
            <label className="block text-gray-600 text-sm mb-1">Project Name</label>
            <p className="text-gray-800 font-medium">{project.name}</p>
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">Project Code</label>
            <p className="text-gray-800 font-medium">{project.code}</p>
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">Date</label>
            <p className="text-gray-800 font-medium">{project.date}</p>
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-1">Status</label>
            <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium 
              ${project.status === 'Processing' ? 'bg-green-100 text-green-700' :
                project.status === 'Pending' ? 'bg-red-100 text-red-700' :
                'bg-purple-100 text-purple-700'
              }`}
            >
              {project.status}
            </span>
          </div>
        </div>

        {/* Right Column - Team Members */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-4">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Project Manager"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-gray-800 font-medium mb-1">Project Manager</p>
          <p className="text-gray-600 text-sm">John Doe</p>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button 
          className="bg-gray-200 text-gray-700 px-8 py-2 rounded-full hover:bg-gray-300 transition-colors"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProjectDetailModal; 