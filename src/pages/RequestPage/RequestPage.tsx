import React from 'react';
import { Table, Input, Modal, Form } from 'antd';
import { Trash, Edit, UserCheck } from 'lucide-react';
import { useState } from 'react';
import './RequestPage.css';

const { Search } = Input;

interface ClaimRequest {
  key: string;
  claimId: string;
  project: string;
  date: string;
  status: string;
}

const data: ClaimRequest[] = [
  {
    key: '1',
    claimId: '013452',
    project: 'Anaconda address',
    date: '10/02/2025',
    status: 'Approved',
  },
  {
    key: '2',
    claimId: '013453',
    project: 'Anaconda address',
    date: '10/02/2025',
    status: 'Waiting',
  },
  {
    key: '3',
    claimId: '013454',
    project: 'Python Project',
    date: '11/02/2025',
    status: 'Approved',
  },
  {
    key: '4',
    claimId: '013455',
    project: 'React Development',
    date: '12/02/2025',
    status: 'Waiting',
  },
  {
    key: '5',
    claimId: '013456',
    project: 'Mobile App',
    date: '13/02/2025',
    status: 'Approved',
  },
  {
    key: '6',
    claimId: '013457',
    project: 'Database Migration',
    date: '14/02/2025',
    status: 'Waiting',
  },
  {
    key: '7',
    claimId: '013458',
    project: 'Cloud Infrastructure',
    date: '15/02/2025',
    status: 'Approved',
  },
  {
    key: '8',
    claimId: '013459',
    project: 'Security Audit',
    date: '16/02/2025',
    status: 'Waiting',
  },
  {
    key: '9',
    claimId: '013460',
    project: 'UI/UX Design',
    date: '17/02/2025',
    status: 'Approved',
  },
  {
    key: '10',
    claimId: '013461',
    project: 'API Integration',
    date: '18/02/2025',
    status: 'Waiting',
  }
];

const RequestPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [tableData, setTableData] = useState(data);
  const [form] = Form.useForm();

  const columns = [
    {
      title: <span className="text-black text-lg font-medium">Claim ID</span>,
      dataIndex: 'claimId',
      key: 'claimId',
      render: (text: string) => <span className="text-[#FF914D] font-semibold text-base">{text}</span>,
    },
    {
      title: <span className="text-black text-lg font-medium">Project</span>,
      dataIndex: 'project',
      key: 'project',
      render: (text: string) => <span className="text-gray-700 font-medium text-base">{text}</span>,
    },
    {
      title: <span className="text-black text-lg font-medium">Date</span>,
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => <span className="text-gray-700 font-medium text-base">{text}</span>,
    },
    {
      title: <span className="text-black text-lg font-medium">Status</span>,
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <span className={`${text === 'Approved' ? 'text-green-600' : 'text-yellow-600'} font-semibold text-base`}>
          {text}
        </span>
      ),
    },
    {
      title: <span className="text-black text-lg font-medium">Action</span>,
      key: 'action',
      render: (_: any, record: ClaimRequest) => (
        <div className="flex space-x-4">
          <Trash className="text-red-600 cursor-pointer hover:opacity-80" size={24} />
          <Edit 
            className="text-[#FF914D] cursor-pointer hover:opacity-80" 
            size={24} 
            onClick={() => handleEdit(record)}
          />
        </div>
      ),
    },
    {
      title: <span className="text-black text-lg font-medium">Request Approve</span>,
      key: 'requestApprove',
      render: () => (
        <div className="flex items-center">
          <UserCheck className="text-green-500 cursor-pointer hover:opacity-80" size={24} />
        </div>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsEditModalOpen(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalOpen(false);
    form.resetFields();
  };

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      setTableData(prevData => 
        prevData.map(item => 
          item.key === editingRecord.key ? { ...item, ...values } : item
        )
      );
      setIsEditModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <div className="request-page-container">
      <h1 className="request-page-title">Claim-Request Management</h1>
      <Search 
        placeholder="Type to search" 
        className="request-page-search"
        style={{ 
          backgroundColor: '#f9fafb',
          borderRadius: '4px',
          padding: '10px',
          fontSize: '16px',
        }}
      />
      <Table 
        columns={columns} 
        dataSource={tableData} 
        pagination={{
          pageSize: 5,
          total: data.length,
          current: currentPage,
          onChange: handlePageChange,
          showSizeChanger: false,
          itemRender: (_page, type, originalElement) => {
            if (type === 'prev') {
              return <a className="text-[#FF914D] text-lg">‹</a>;
            }
            if (type === 'next') {
              return <a className="text-[#FF914D] text-lg">›</a>;
            }
            return originalElement;
          },
        }}
        className="border rounded-lg"
        components={{
          header: {
            cell: (props: any) => (
              <th
                {...props}
                style={{
                  backgroundColor: '#FF914D',
                  color: 'white',
                  fontWeight: 'normal',
                  padding: '18px 22px',
                }}
              />
            ),
          },
        }}
        rowClassName="hover:bg-gray-50"
      />

      <Modal
        title="Edit Claim Request"
        open={isEditModalOpen}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingRecord}
        >
          <Form.Item
            label="Claim ID"
            name="claimId"
            rules={[{ required: true, message: 'Please input claim ID!' }]}
          >
            <Input />
          </Form.Item>
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
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please input status!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RequestPage;