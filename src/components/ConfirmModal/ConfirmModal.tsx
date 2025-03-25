import { Input, Modal } from "antd";
import Icons from "../icon";
import { updateClaimStatus } from "../../services/claimService";
import { toast } from "react-toastify";
import { useState } from "react";

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface MessageProps {
  message: string;
  id: string;
}

interface ConfirmModalProps {
  modalProps: ModalProps;
  messageProps: MessageProps;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  modalProps,
  messageProps
}) => {
  const { visible, onClose, onConfirm } = modalProps;
  const { message, id } = messageProps;
  const MESSAGE = `Confirm ${message} this claim request?`;
  const [comment, setComment] = useState<string>("");

  const handleStatusChange = async () => {
    const response = await updateClaimStatus({ _id: id, claim_status: message, comment: comment });
    if (response.success) {
      toast.success(`Claim request has been ${message.toLowerCase()} successfully!`);
    }
    onConfirm();
  }

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onOk={handleStatusChange}
      okButtonProps={{ className: `${message === "Approved" ? "!bg-green-600" : message === "Rejected" ? "!bg-red-600" : "!bg-blue-600"} text-white` }}
      okText={message} cancelText="Cancel"
      title={<h4 className={`${message === "Approved" ? "!text-green-600" : message === "Rejected" ? "!text-red-600" : "!text-blue-600"} text-2xl font-semibold border-b pb-2`}>
        {message} Claim Request</h4>}
      className="flex items-center justify-center rounded-2xl" >
      <div className="p-4 inline-flex items-center gap-2">
        {message === "Approved" ?
          <>
            <Icons.CircleCheck className="w-16 h-16 mx-auto text-green-600" />
            <p className="my-2 font-semibold text-lg">{MESSAGE}</p>
          </>
          : message === "Rejected" ?
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-2">
                <Icons.CircleReject className="w-16 h-16 mx-auto text-red-600" />
                <p className="my-2 font-semibold text-lg">{MESSAGE}</p>
              </div>
              <Input.TextArea
                rows={3}
                className="w-full mt-2"
                placeholder="Enter your rejected reason here"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              {message === "Rejected" && !comment && (
                <p className="text-red-600 mt-1">Please enter your rejected reason!</p>
              )}
            </div>
            : null}
      </div>
    </Modal>
  );
};

export default ConfirmModal;