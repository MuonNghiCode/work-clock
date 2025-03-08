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
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
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
            className="w-full"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            loading={loading}
            disabled={loading}
            className="px-4 py-2 bg-[#FF914D] text-white rounded-md hover:bg-[#FEB78A]"
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RequestApprovalModal;