import React, { useState, useEffect } from "react";
import { Modal, Input } from "antd";
import Icons from "../icon";
type FormModal = "Approve" | "Reject" | "Return";

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onClose,
  message,
}) => {
  const [formMdal, setFormModal] = useState<FormModal>();
  const [returnReason, setReturnReason] = useState("");
  const { Approve, Reject, Return } = Icons;

  useEffect(() => {
    const checkFormType = () => {
      if (message.includes("Approve")) {
        setFormModal("Approve");
      } else if (message.includes("Reject")) {
        setFormModal("Reject");
      } else if (message.includes("Return")) {
        setFormModal("Return");
      }
    };
    checkFormType();
  }, [message]);

  const handleReturnReasonChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReturnReason(e.target.value);
  };

  const handleOk = () => {
    if (message.includes("Return")) {
      console.log("Return reason:", returnReason);
    }
    onClose();
  };

  return (
    <Modal
      title="Confirmation"
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
      okText="Confirm"
      cancelText="Cancel"
    >
      <div className="flex items-center space-x-4">
        {formMdal === "Approve" && (
          <Approve className="w-12 h-12" color="green" strokeWidth={3} />
        )}
        {formMdal === "Reject" && (
          <Reject className="w-12 h-12" color="red" strokeWidth={3} />
        )}
        {formMdal === "Return" && (
          <Return className="w-12 h-12" color="blue" strokeWidth={3} />
        )}
        <span className="text-2xl font-squada ">{message}</span>
      </div>
      {message.includes("Return") && (
        <div className="mt-4">
          <Input.TextArea
            placeholder="Enter return reason"
            value={returnReason}
            onChange={handleReturnReasonChange}
          />
        </div>
      )}
    </Modal>
  );
};

export default ConfirmModal;
