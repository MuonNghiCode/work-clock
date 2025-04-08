import { Input, Modal } from "antd";
import Icons from "../icon";
import { updateClaimStatus } from "../../services/claimService";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { sendNotification } from "../../services/notificationService";

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface MessageProps {
  message: string;
  id: string;
  receiveId: string;
}

interface ConfirmModalProps {
  modalProps: ModalProps;
  messageProps: MessageProps;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  modalProps,
  messageProps,
}) => {
  const { visible, onClose, onConfirm } = modalProps;
  const { message, id } = messageProps;
  console.log("message", message);
  const MESSAGE = `Confirm ${message} this claim request?`;
  const [comment, setComment] = useState<string>("");
  const [status, setStatus] = useState<string>(message);
  useEffect(() => {
    message === "Return" ? setStatus("Draft") : setStatus(message);
  }, [message]);

  const handleStatusChange = async () => {
    const response = await updateClaimStatus({
      _id: id,
      claim_status: status,
      comment: comment,
    });
    if (response.success) {
      if (status === "Approved") {
        sendNotification(
          messageProps.receiveId,
          "Your claim request has been approved",
          "Approved"
        );
      } else if (status === "Rejected" && comment) {
        sendNotification(
          messageProps.receiveId,
          `Your claim request has been rejected. Reason: ${comment}`,
          "Rejected"
        );
      } else if (message === "Return" && comment) {
        sendNotification(
          messageProps.receiveId,
          `Your claim request has been returned. Reason: ${comment}`,
          "Return"
        );
      }
      toast.success(
        `Claim request has been ${message.toLowerCase()} successfully!`
      );
    }
    onConfirm();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onOk={handleStatusChange}
      okButtonProps={{
        className: `${
          message === "Approved"
            ? "!bg-green-600"
            : message === "Rejected"
            ? "!bg-red-600"
            : "!bg-blue-600"
        } text-white`,
      }}
      okText={message}
      cancelText="Cancel"
      title={
        <h4
          className={`${
            message === "Approved"
              ? "!text-green-600"
              : message === "Rejected"
              ? "!text-red-600"
              : "!text-blue-600"
          } text-2xl font-semibold border-b pb-2`}
        >
          {message} Claim Request
        </h4>
      }
      className="w-full flex items-center rounded-2xl"
    >
      <div className="w-full p-4 flex items-center gap-2">
        {message === "Approved" ? (
          <div className="w-full flex  items-center p-4 bg-gray-100 rounded-xl">
            <Icons.Check className="w-16 h-16 mx-auto text-green-600" />
            <p className="my-2 font-semibold text-lg text-green-500">
              {MESSAGE}
            </p>
          </div>
        ) : message === "Rejected" ? (
          <div className="w-full flex flex-col items-center p-4 bg-gray-100  rounded-xl shadow-md">
            <div className="inline-flex items-center gap-3 p-3 bg-transparent  rounded-lg ">
              <Icons.Reject className="w-12 h-12 text-red-500" />
              <p className="font-semibold text-lg text-red-500 ">{MESSAGE}</p>
            </div>

            <Input.TextArea
              rows={3}
              className={`w-full mt-3 p-3 border rounded-lg focus:outline-none ${
                message === "Rejected" && !comment
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter your rejected reason here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {message === "Rejected" && !comment && (
              <p className="text-red-500 mt-2 text-sm font-medium">
                Please enter your rejected reason!
              </p>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center p-4 bg-gray-100  rounded-xl shadow-md">
            <div className="inline-flex items-center gap-3 p-3 bg-transparent rounded-lg ">
              <Icons.Undo className="w-12 h-12 text-blue-500" />
              <p className="font-semibold text-lg text-blue-500">{MESSAGE}</p>
            </div>

            <Input.TextArea
              rows={3}
              className={`w-full mt-3 p-3 border rounded-lg focus:outline-none ${
                message === "Return" && !comment
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              placeholder="Enter your return reason here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {message === "Return" && !comment && (
              <p className="text-red-500 mt-2 text-sm font-medium">
                Please enter your return reason!
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmModal;
