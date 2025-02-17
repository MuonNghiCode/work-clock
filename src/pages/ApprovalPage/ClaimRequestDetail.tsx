import React from "react";
import { Modal, Table, Input, Row, Col } from "antd";

interface ClaimRequestModalProps {
  visible: boolean;
  onClose: () => void;
}

const ClaimRequestDetail: React.FC<ClaimRequestModalProps> = ({
  visible,
  onClose,
}) => {
  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Day", dataIndex: "day", key: "day" },
    { title: "From", dataIndex: "from", key: "from" },
    { title: "To", dataIndex: "to", key: "to" },
    { title: "Total Hours", dataIndex: "totalHours", key: "totalHours" },
  ];

  const data = Array(1).fill({
    key: Math.random().toString(),
    date: "12/12/2024",
    day: "Thursday",
    from: "5 pm",
    to: "8 pm",
    totalHours: "3 hours",
  });

  return (
    <Modal
      title="Claim Request Detail"
      open={visible}
      onCancel={onClose}
      footer={null}
      style={{ minWidth: "70%", maxWidth: "90%" }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <label>Date Created</label>
          <Input value="12/02/2025" disabled />
        </Col>
        <Col span={12}>
          <label>Phone</label>
          <Input value="(+84) 123456789" disabled />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 8 }}>
        <Col span={12}>
          <label>Name</label>
          <Input value="Nguyen Van A" disabled />
        </Col>
        <Col span={12}>
          <label>Email</label>
          <Input value="nguyenvana@gmail.com" disabled />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 8 }}>
        <Col span={12}>
          <label>Project</label>
          <Input value="Project Mock project" disabled />
        </Col>
        <Col span={12}>
          <label>Role in Project</label>
          <Input value="Front-end Dev" disabled />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 8 }}>
        <Col span={12}>
          <label>Duration</label>
          <Input value="3 months" disabled />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        style={{ marginTop: 16 }}
      />
      <div
        style={{ textAlign: "right", marginTop: "1rem", fontWeight: "bold" }}
      >
        Total working hours:{" "}
        <span
          style={{ background: "#ff7f50", padding: "5px", borderRadius: "5px" }}
        >
          15 hours
        </span>
      </div>
    </Modal>
  );
};

export default ClaimRequestDetail;
