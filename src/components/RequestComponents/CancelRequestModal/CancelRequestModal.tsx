import React from 'react';
import { Modal } from 'antd';
import { motion } from "framer-motion";

interface ClaimRequest {
  key: string;
  claimname: string;
  project: string;
  start_date: string;
  end_date: string;
  totalHours: string;
  timeFrom: string;
  timeTo: string;
  status: string;
  approval_name: string;
}

interface CancelModalProps {
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
  cancelingRecord: ClaimRequest | null; // Thêm thông tin claim đang bị hủy
}

const CancelRequestModal: React.FC<CancelModalProps> = ({ isOpen, onOk, onCancel, cancelingRecord }) => {
  return (
    <Modal
      title="Confirm Cancel"
      open={isOpen}
      onOk={onOk}
      onCancel={onCancel}
      okText="Yes"
      cancelText="No"
      okButtonProps={{ danger: true }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 100,
        }}
      >
        <p>
          Are you sure you want to cancel the claim request "
          <span className="font-semibold">{cancelingRecord?.claimname || 'Unknown'}</span>"?
        </p>
      </motion.div>
    </Modal>
  );
};

export default CancelRequestModal;