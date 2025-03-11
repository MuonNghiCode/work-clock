import React from "react";
import { Modal, Button, Input, Select, Form } from "antd";
import { format } from "date-fns";
import emailjs from "@emailjs/browser";
import { updateClaimStatus } from "../../services/claimService";

const { TextArea } = Input;
const { Option } = Select;

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
  const [form] = Form.useForm();

  const handleConfirm = () => {
    form
      .validateFields()
      .then((values) => {
        sendEmail(values);
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
        if (onConfirm) onConfirm(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
        onStateChange("error");
      });
  };

  const sendEmail = (formData: any) => {
    const templateParams = {
      title: formData.title,
      amount: formData.amount,
      email: formData.email,
      to_email: formData.to_email,
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

  const handleClose = () => {
    onClose();
  };

  const formatNumberWithCommas = (value: string) => {
    const cleanedValue = value.replace(/[^0-9.]/g, "");
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumberWithCommas(e.target.value);
    form.setFieldsValue({ amount: formattedValue });
  };

  return (
    <Modal
      title={"Payment"}
      open={isVisible}
      onCancel={handleClose}
      footer={[
        <Button key="submit" type="primary" onClick={handleConfirm}>
          Confirm
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          payment: "Card",
          email: accountantEmail,
          to_email: email,
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="Enter the title..." />
          </Form.Item>
          <Form.Item label="Claimer">
            <Input value={claimer} readOnly />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              { required: true, message: "Amount is required" },
              {
                validator: (_, value) =>
                  parseFloat(value.replace(/,/g, "")) > 0
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Amount must be greater than 0")
                      ),
              },
            ]}
          >
            <Input
              type="text"
              placeholder="Value"
              onChange={handleAmountChange}
            />
          </Form.Item>
          <Form.Item label="Date">
            <Input value={format(date, "dd-MM-yyyy")} readOnly />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Accountant Email" name="email">
            <Input type="email" placeholder="Your email address" readOnly />
          </Form.Item>
          <Form.Item label="Recipient Email" name="to_email">
            <Input placeholder="Recipient email address" readOnly />
          </Form.Item>
          <Form.Item
            label="Payment"
            name="payment"
            rules={[
              { required: true, message: "Please select a payment method" },
            ]}
          >
            <Select>
              <Option value="Card">Card</Option>
              <Option value="Bank">Bank</Option>
              <Option value="Cash">Cash</Option>
            </Select>
          </Form.Item>
        </div>
        <Form.Item
          label="Message"
          name="message"
          rules={[{ required: true, message: "Message is required" }]}
        >
          <TextArea placeholder="Input your message" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PaymentModal;
