import { Input, Modal } from "antd";
import Icons from "../icon";
import { changeClaimStatus } from "../../services/claimService";
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
    const response = await changeClaimStatus(id, message, comment);
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
      <div className="p-4 inline-flex items-center">
        {message === "Approved" ?
          <>
            <Icons.Approve className="w-20 h-20 mx-auto text-green-600" />
            <p className="my-2 font-semibold text-lg">{MESSAGE}</p>
          </>
          : message === "Rejected" ?
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center">
                <Icons.Reject className="w-20 h-20 mx-auto text-red-600" />
                <p className="my-2 font-semibold text-lg">{MESSAGE}</p>
              </div>
              <Input.TextArea
                rows={3}
                className="w-full mt-2"
                placeholder="Enter your rejected reason here"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            : null}
      </div>
    </Modal>
  );
};

export default ConfirmModal;