import React from 'react';
import { Modal, Form, Input } from 'antd';

interface EditRequestModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onOk: () => void;
  form: any;
  editingRecord: any;
}

const EditRequestModal: React.FC<EditRequestModalProps> = ({ isOpen, onCancel, onOk, form, editingRecord }) => {
  return (
    <Modal
      title="Edit Claim Request"
      open={isOpen}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={editingRecord}
      >
        <Form.Item
          label="Project"
          name="project"
          rules={[{ required: true, message: 'Please input project name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: 'Please input date!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Time From"
          name="timeFrom"
          rules={[{ required: true, message: 'Please input start time!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Time To"
          name="timeTo"
          rules={[{ required: true, message: 'Please input end time!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Total Hours"
          name="totalHours"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
        >
          <Input disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditRequestModal;