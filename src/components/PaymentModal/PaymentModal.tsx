import React from "react";

interface PaymentModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  claimer: string;
  date: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  claimer,
  date,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Payment</h2>
          <button onClick={onClose} className="text-red-500 text-xl">
            ✖
          </button>
        </div>
        <form>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm">Title</label>
              <input
                type="text"
                placeholder="Enter the title..."
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Claimer</label>
              <input
                type="text"
                value={claimer}
                readOnly
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Amount</label>
              <input
                type="text"
                placeholder="Value"
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Date</label>
              <input
                type="text"
                value={date}
                readOnly
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Email</label>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Payment</label>
              <select className="w-full border p-2 rounded">
                <option>Card</option>
                <option>Bank</option>
                <option>Cash</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm">Message</label>
            <textarea
              placeholder="Input your message"
              className="w-full border p-2 rounded"
            ></textarea>
          </div>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full bg-black text-white py-2 rounded"
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
