import React from 'react';
import { Modal, Input, Button } from 'antd';

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

interface RequestApprovalModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: (comment: string) => void;
  approvingRecord: ClaimRequest | null;
  loading?: boolean;
}

const { TextArea } = Input;

const RequestApprovalModal: React.FC<RequestApprovalModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  approvingRecord,
  loading = false,
}) => {
  const [comment, setComment] = React.useState('');

  const handleConfirm = () => {
    onConfirm(comment);
    setComment(''); 
  };

  const handleCancel = () => {
    setComment(''); 
    onCancel();
  };

  return (
    <Modal
      title="Request Approval"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={500}
      className="request-approval-modal"
    >
      <div className="p-6 bg-gray-50 rounded-xl">
        <h3 className="text-lg font-bold text-[#FF9447] mb-4">
          Request Approval for: {approvingRecord?.claimname || 'N/A'}
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment (Optional)
          </label>
          <TextArea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment here..."
            className="w-full rounded-md"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 rounded-md"
            style={{
              backgroundColor: '#F3F4F6',
              color: '#4B5563',
              border: 'none',
              fontWeight: 400,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            loading={loading}
            disabled={loading}
            className="px-4 py-2 rounded-md"
            style={{
              backgroundColor: '#FF9447',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 400,
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RequestApprovalModal;