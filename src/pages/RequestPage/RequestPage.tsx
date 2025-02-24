import React, { useState } from 'react';
import { Form } from 'antd';
import EditRequestModal from '../../components/RequestComponents/EditRequestModal/EditRequestModal';
import DeleteRequestModal from '../../components/RequestComponents/DeleteRequestModal/DeleteRequestModal';
import TableRequest from '../../components/RequestComponents/TableRequest/TableRequest';

interface ClaimRequest {
  key: string;
  project: string;
  date: string;
  totalHours: string;
  timeFrom: string;
  timeTo: string;
  status: string;
}

const calculateHours = (timeFrom: string, timeTo: string): number => {
  const convertTime = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours + minutes / 60;
  };

  const fromHours = convertTime(timeFrom);
  const toHours = convertTime(timeTo);
  
  return Math.round(toHours - fromHours);
};

const data: ClaimRequest[] = [
  {
    key: '1',
    project: 'Anaconda address',
    date: '10/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Approved',
  },
  {
    key: '2',
    project: 'Anaconda address',
    date: '10/02/2025',
    timeFrom: '2:00 PM',
    timeTo: '5:00 PM',
    totalHours: calculateHours('2:00 PM', '5:00 PM').toString(),
    status: 'Waiting',
  },
  {
    key: '3',
    project: 'Python Project',
    date: '11/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Draft',
  },
  {
    key: '4',
    project: 'React Development',
    date: '12/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Waiting',
  },
  {
    key: '5',
    project: 'Mobile App',
    date: '13/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Approved',
  },
  {
    key: '6',
    project: 'Database Migration',
    date: '14/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Draft',
  },
  {
    key: '7',
    project: 'Cloud Infrastructure',
    date: '15/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Approved',
  },
  {
    key: '8',
    project: 'Security Audit',
    date: '16/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Waiting',
  },
  {
    key: '9',
    project: 'UI/UX Design',
    date: '17/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Approved',
  },
  {
    key: '10',
    project: 'API ',
    date: '18/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Waiting',
  },
  {
    key: '11',
    project: 'API 2 ',
    date: '19/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Approved',
  },
  {
    key: '12',
    project: 'API 3',
    date: '20/02/2025',
    timeFrom: '10:00 PM',
    timeTo: '15:00 PM',
    totalHours: calculateHours('10:00 PM', '15:00 PM').toString(),
    status: 'Rejected',
  },

];

const RequestPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [tableData, setTableData] = useState(data);
  const [form] = Form.useForm();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<ClaimRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState('');

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
      const totalHours = calculateHours(values.timeFrom, values.timeTo).toString();
      
      setTableData(prevData => 
        prevData.map(item => 
          item.key === editingRecord.key 
            ? { ...item, ...values, totalHours } 
            : item
        )
      );
      setIsEditModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleDelete = (record: ClaimRequest) => {
    setDeletingRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalOk = () => {
    if (deletingRecord) {
      setTableData(prevData => prevData.filter(item => item.key !== deletingRecord.key));
      setIsDeleteModalOpen(false);
      setDeletingRecord(null);
    }
  };

  const handleDeleteModalCancel = () => {
    setIsDeleteModalOpen(false);
    setDeletingRecord(null);
  };

  const handleSearch = (value: string) => {
    setCurrentPage(1);
    setSearchText(value);
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status === "All" ? null : status);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-orange-100 shadow-md rounded-lg ">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Request-Page Management</h1>
      <TableRequest
        data={tableData}
        currentPage={currentPage}
        pageSize={pageSize}
        statusFilter={statusFilter}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        searchText={searchText}
      />

      <EditRequestModal
        isOpen={isEditModalOpen}
        onCancel={handleEditModalCancel}
        onOk={handleEditModalOk}
        form={form}
        editingRecord={editingRecord}
      />

      <DeleteRequestModal
        isOpen={isDeleteModalOpen}
        onOk={handleDeleteModalOk}
        onCancel={handleDeleteModalCancel}
      />
    </div>
  );
};

export default RequestPage;
