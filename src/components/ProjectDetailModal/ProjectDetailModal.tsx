import React from 'react';
import { Project } from '../../types/Project';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  return (
    <div className="w-[800px] max-w-full px-10">
      <h2 className="text-5xl font-bold text-gray-800 mb-10 text-center">Project Details</h2>

      <div className="flex flex-col items-center gap-y-10">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-40 h-40 rounded-full bg-gray-200 overflow-hidden mb-6">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Project Manager"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-gray-800 font-medium text-2xl mb-3">Project Manager</p>
          <p className="text-gray-600 text-xl">John Doe</p>
        </div>

        <div className="w-full space-y-10">
          <div className="space-y-4">
            <label className="block text-gray-700 font-medium text-2xl">Project Name</label>
            <p className="w-full px-8 py-4 border border-gray-300 rounded-lg bg-gray-50 text-xl">{project.name}</p>
          </div>

          <div className="space-y-4">
            <label className="block text-gray-700 font-medium text-2xl">Project Code</label>
            <p className="w-full px-8 py-4 border border-gray-300 rounded-lg bg-gray-50 text-xl">{project.key}</p>
          </div>

          <div className="space-y-4">
            <label className="block text-gray-700 font-medium text-2xl">Date</label>
            <p className="w-full px-8 py-4 border border-gray-300 rounded-lg bg-gray-50 text-xl">{project.date}</p>
          </div>

          <div className="space-y-4">
            <label className="block text-gray-700 font-medium text-2xl">Status</label>
            <div className="w-full px-8 py-4 border border-gray-300 rounded-lg bg-gray-50">
              <span className={`inline-block px-8 py-3 rounded-full text-lg font-medium 
                ${project.status === 'Processing' ? 'bg-green-100 text-green-700' :
                  project.status === 'Pending' ? 'bg-red-100 text-red-700' :
                  'bg-purple-100 text-purple-700'
                }`}
              >
                {project.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <button 
          className="bg-orange-400 text-white px-12 py-5 rounded-full hover:bg-orange-500 transition-colors text-2xl"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProjectDetailModal; 