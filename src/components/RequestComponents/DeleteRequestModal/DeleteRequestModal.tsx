import React from 'react';
import { Modal } from 'antd';

interface DeleteModalProps {
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const DeleteRequestModal: React.FC<DeleteModalProps> = ({ isOpen, onOk, onCancel }) => {
  return (
    <Modal
      title="Confirm Delete"
      open={isOpen}
      onOk={onOk}
      onCancel={onCancel}
      okText="Yes"
      cancelText="No"
      okButtonProps={{ danger: true }}
    >
      <p>Are you sure to delete this claim request?</p>
    </Modal>
  );
};

export default DeleteRequestModal;