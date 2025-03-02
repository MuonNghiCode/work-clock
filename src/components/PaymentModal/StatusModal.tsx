import React from "react";
import { Modal, Button } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

interface StatusModalProps {
  isModalVisible: boolean;
  type: "success" | "error";
  date: string;
  onClose: () => void;
}

const StatusModal: React.FC<StatusModalProps> = ({ type, date, onClose, isModalVisible }) => {
  const isSuccess = type === "success";
  return (
    <Modal open={isModalVisible} footer={null} onCancel={onClose} centered>
      <div className="text-center">
        {isSuccess ? (
          <CheckCircleOutlined style={{ color: "green", fontSize: "48px" }} />
        ) : (
          <CloseCircleOutlined style={{ color: "red", fontSize: "48px" }} />
        )}
        <p className="text-xl font-bold">
          {isSuccess ? "Payment successfully" : "Payment Failed"}
        </p>
        <p>{date}</p>
        <Button type="primary" className="mt-4" onClick={onClose}>
          OK
        </Button>
      </div>
    </Modal>
  );
};

export default StatusModal;
