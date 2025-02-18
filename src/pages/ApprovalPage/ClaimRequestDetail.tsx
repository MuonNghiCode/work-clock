import React from "react";
import { Modal, Table, Row, Col } from "antd";

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
      title={<span className="text-xl lg:text-3xl font-bold">Claim Request Detail</span>}
      open={visible}
      onCancel={onClose}
      footer={null}
      style={{ minWidth: "70%", maxWidth: "100%" }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <strong className="text-xl">Date Created: </strong>
          <span className="text-lg">12/02/2025</span>
        </Col>
        <Col span={12}>
          <strong className="text-xl">Phone</strong>
          <span className="text-lg"> (+84) 123456789 </span>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 8 }}>
        <Col span={12}>
          <strong className="text-xl">Name: </strong>
          <span className="text-lg">Nguyen Van A </span>
        </Col>
        <Col span={12}>
          <strong className="text-xl">Email: </strong>
          <span className="text-lg">nguyenvana@gmail.com </span>
        </Col>
      </Row >
      <Row gutter={16} style={{ marginTop: 8 }}>
        <Col span={12}>
          <strong className="text-xl">Project: </strong>
          <span className="text-lg">Project Mock project </span>
        </Col>
        <Col span={12}>
          <strong className="text-xl">Role: </strong>
          <span className="text-lg">Front-end Dev </span>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 8 }}>
        <Col span={12}>
          <strong className="text-xl">Duration: </strong>
          <span className="text-lg">3 months </span>
        </Col>
      </Row>
      <Table
        className="!font-squada"
        columns={columns}
        dataSource={data}
        pagination={false}
        style={{ marginTop: 16 }}
      />
      <div
        className="mt-4 text-right font-bold text-xl"
      >
        Total working hours: {" "}
        <span
          className="bg-[#ff7f50] p-2 rounded-lg text-white"
        >
          15 hours
        </span>
      </div >
    </Modal >
  );
};

export default ClaimRequestDetail;
