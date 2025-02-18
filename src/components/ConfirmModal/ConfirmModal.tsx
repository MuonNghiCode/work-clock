import Modal from "../Modal/Modal";

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onClose,
  message,
  onConfirm
}) => {
  return (
    <Modal isOpen={visible} onClose={onClose}>
      <div className="w-[400px] p-6">
        <h3 className="text-xl font-bold mb-4">Confirm</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal; 