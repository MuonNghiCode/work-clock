import React from 'react';
import { Modal } from 'antd';

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
      <p>
        Are you sure you want to cancel the claim request "
        <span className="font-semibold">{cancelingRecord?.claimname || 'Unknown'}</span>"?
      </p>
    </Modal>
  );
};

export default CancelRequestModal;