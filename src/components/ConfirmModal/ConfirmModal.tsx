import { Modal } from "antd";
import Icons from "../icon";

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface MessageProps {
  message: string;
  id?: string;
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
  const handleStatusChange = () => {
    console.log('id', id);
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
        {message === "Approved" ? <Icons.Approve className="w-20 h-20 mx-auto text-green-600" />
          : message === "Rejected" ? <Icons.Reject className="w-20 h-20 mx-auto text-red-600" />
            : <Icons.Cancel className="w-20 h-20 mx-auto text-blue-600" />}
        <p className="my-2 font-semibold text-lg">{MESSAGE}</p>
      </div>
    </Modal>
  );
};

export default ConfirmModal;