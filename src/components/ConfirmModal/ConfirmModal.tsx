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
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative z-50 bg-white rounded-2xl shadow-lg">
        <div className="w-[400px] p-6">
          <h2 className="text-2xl font-bold mb-4">Confirm</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 