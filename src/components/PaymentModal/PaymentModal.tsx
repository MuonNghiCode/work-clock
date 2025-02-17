import React from "react";
import { Modal, Button, Input, Select } from "antd";

const { TextArea } = Input;
const { Option } = Select;

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
  return (
    <Modal
      title={"Payment"}
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="submit" type="primary" onClick={onConfirm}>
          Confirm
        </Button>,
      ]}
    >
      <form>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm">Title</label>
            <Input placeholder="Enter the title..." />
          </div>
          <div>
            <label className="block text-sm">Claimer</label>
            <Input value={claimer} readOnly />
          </div>
          <div>
            <label className="block text-sm">Amount</label>
            <Input placeholder="Value" />
          </div>
          <div>
            <label className="block text-sm">Date</label>
            <Input value={date} readOnly />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <Input type="email" placeholder="Your email address" />
          </div>
          <div>
            <label className="block text-sm">Payment</label>
            <Select defaultValue="Card">
              <Option value="Card">Card</Option>
              <Option value="Bank">Bank</Option>
              <Option value="Cash">Cash</Option>
            </Select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm">Message</label>
          <TextArea placeholder="Input your message" />
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal;
