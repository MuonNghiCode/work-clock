import React from "react";
import { format } from "date-fns";
import emailjs from "@emailjs/browser";
import { updateClaimStatus } from "../../services/claimService";
import { formatCurrency } from "../../utils/formatCurrency";

interface PaymentModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  onStateChange: (status: "success" | "error") => void;
  claimer: string;
  date: Date;
  email: string;
  accountantEmail: string;
  claim_name: string;
  claimId: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  onStateChange,
  claimer,
  date,
  email,
  accountantEmail,
  claim_name,
  claimId,
}) => {
  const [formData, setFormData] = React.useState({
    title: "",
    amount: 0,
    payment: "Card",
    message: "",
  });

  const [titleError, setTitleError] = React.useState<string | null>(null);

  const handleConfirm = () => {
    if (!formData.title.trim()) {
      setTitleError("Title cannot be empty");
      return;
    }
    sendEmail(formData);
    updateClaimStatus({
      _id: claimId,
      claim_status: "Paid",
      comment: "Payment confirmed",
    })
      .then(() => {
        console.log("Claim status updated successfully");
      })
      .catch((error) => {
        console.error("Failed to update claim status:", error);
      });
    if (onConfirm) onConfirm(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "amount") {
      // Xóa ký tự không phải số
      const numericValue = value.replace(/\./g, "").replace(/[^0-9]/g, "");
      setFormData({
        ...formData,
        [name]: parseFloat(numericValue) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (name === "title" && value.trim()) {
      setTitleError(null);
    }
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("vi-VN", { style: "decimal" });
  };

  const sendEmail = (formData: any) => {
    const templateParams = {
      title: formData.title,
      amount: formatCurrency(formData.amount),
      email: accountantEmail,
      to_email: email,
      message: formData.message,
      transaction: formData.payment,
      claimer: claimer,
      claim_name: claim_name,
      date: format(date, "dd-MM-yyyy"),
    };

    emailjs
      .send(
        "service_l9qbtvf",
        "template_0zbg9cg",
        templateParams,
        "EV-tXrDmzrcr5DOwr"
      )
      .then((response) => {
        console.log("Email sent successfully!", response.status, response.text);
        onStateChange("success");
      })
      .catch((error) => {
        console.error("Failed to send email:", error);
        onStateChange("error");
      });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isVisible ? "block" : "hidden"
      }`}
    >
      <div
        className="absolute inset-0 bg-black opacity-50 focus:outline-none"
        aria-label="Close modal"
      ></div>
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/2 z-10">
        <h2 className="text-3xl font-bold mb-4 text-orange-500">Payment</h2>
        <form>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 w-full"
                placeholder="Enter the title..."
                required
              />
              {titleError && (
                <p className="text-red-500 text-sm mt-1">{titleError}</p>
              )}
            </div>
            <div>
              <label className="block mb-1">Claimer</label>
              <input
                value={claimer}
                readOnly
                className="border-b border-gray-300 rounded-lg p-2 w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Amount</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <input
                  name="amount"
                  value={formatAmount(formData.amount)}
                  onChange={handleChange}
                  className="p-2 w-full rounded-l-lg"
                  placeholder="Value"
                />
                <span className="p-2">VND</span>
              </div>
            </div>
            <div>
              <label className="block mb-1">Date</label>
              <input
                value={format(date, "dd-MM-yyyy")}
                readOnly
                className="border-b border-gray-300 rounded-lg p-2 w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Payment</label>
              <select
                name="payment"
                value={formData.payment}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 w-full"
              >
                <option value="Card">Card</option>
                <option value="Bank">Bank</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
              placeholder="Input your message"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-black rounded-lg px-4 py-2 mr-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 ${
                titleError ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!!titleError}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
