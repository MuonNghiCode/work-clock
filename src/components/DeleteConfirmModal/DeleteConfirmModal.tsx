import React from 'react';
import { ProjectInfo } from '../../types/Project';
import { Modal } from 'antd';

interface DeleteConfirmModalProps {
  project: ProjectInfo;
  onClose: () => void;
  onConfirm: () => void;
  visible: boolean
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ project, onClose, onConfirm, visible }) => {
  return (
    <Modal open={visible} onCancel={onClose} onOk={onConfirm} 
    okText='Delete'
    okButtonProps={{ style: { backgroundColor: 'red' } }}
    title="">
    <div className="p-2 flex-col items-center">
      <h1 className='border-b-2 text-3xl font-squada font-bold py-2 text-red-600'>Confirm Delete</h1>
    <h2 className='font-squada text-xl pt-2'>Are you sure you want to delete project "{project.project_name}"? This action cannot be undone.
    </h2>
    </div>
    </Modal>
  );
};

export default DeleteConfirmModal; 