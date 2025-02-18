import React from 'react';
import { Project } from '../types/Project';

interface DeleteConfirmModalProps {
  project: Project;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ project, onClose, onConfirm }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Delete Project</h2>
      <p className="text-gray-600 mb-8">
        Are you sure you want to delete project "{project.name}"? This action cannot be undone.
      </p>
      <div className="flex justify-center gap-4">
        <button
          className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmModal; 