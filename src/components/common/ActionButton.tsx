import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';

interface ActionButtonsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onView, onEdit, onDelete }) => {
  return (
    <div className="flex gap-2 justify-end">
      <button
        onClick={onView}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Eye className="w-5 h-5 text-blue-600" />
      </button>
      <button
        onClick={onEdit}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Edit2 className="w-5 h-5 text-green-600" />
      </button>
      <button
        onClick={onDelete}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Trash2 className="w-5 h-5 text-red-600" />
      </button>
    </div>
  );
};

export default ActionButtons; 