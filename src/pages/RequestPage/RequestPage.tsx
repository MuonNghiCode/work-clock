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

const RequestPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
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
      const updatedRecord = { ...editingRecord, ...values, totalHours };
      
      setIsEditModalOpen(false);
      form.resetFields();
      return updatedRecord;
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

  const handlePageChange = (page: number, newPageSize?: number) => {
    // Nếu pageSize thay đổi, reset currentPage về 1
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1); // Reset về trang 1 khi đổi pageSize
    } else {
      setCurrentPage(page);
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