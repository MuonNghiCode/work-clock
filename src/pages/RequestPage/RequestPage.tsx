import React, { useState, useEffect } from 'react';
import { Form } from 'antd';
import EditRequestModal from '../../components/RequestComponents/EditRequestModal/EditRequestModal';
import DeleteRequestModal from '../../components/RequestComponents/DeleteRequestModal/DeleteRequestModal';
import TableRequest from '../../components/RequestComponents/TableRequest/TableRequest';
import { getClaimerSearch } from '../../services/claimService';
import { ClaimItem, SearchCondition, PageInfoRequest } from '../../types/ClaimType';
import { ResponseModel } from '../../models/ResponseModel';

interface ClaimRequest {
  key: string;
  claimname: string;
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
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours + minutes / 60;
  };
  const fromHours = convertTime(timeFrom);
  const toHours = convertTime(timeTo);
  return Math.round(toHours - fromHours);
};

const RequestPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<ClaimRequest | null>(null);
  const [form] = Form.useForm();
  const [apiData, setApiData] = useState<ClaimRequest[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const mapClaimToRequest = (item: ClaimItem): ClaimRequest => ({
    key: item._id,
    claimname: item.claim_name || 'Unnamed Claim',
    project: item.project_info?.project_name || 'Unknown', // Thêm project
    date: new Date(item.claim_start_date).toLocaleDateString('vi-VN'),
    timeFrom: new Date(item.claim_start_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    timeTo: new Date(item.claim_end_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    totalHours: item.total_work_time?.toString() || String(Math.round((new Date(item.claim_end_date).getTime() - new Date(item.claim_start_date).getTime()) / (1000 * 60 * 60))),
    status: item.claim_status || 'Unknown'
  });

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const searchCondition: SearchCondition = {
        keyword: searchText,
        claim_status: statusFilter === 'All' || !statusFilter ? '' : statusFilter,
        claim_start_date: '',
        claim_end_date: '',
        is_delete: false
      };
      const pageInfo: PageInfoRequest = { pageNum: currentPage, pageSize };

      const response: ResponseModel<{ pageData: ClaimItem[], pageInfo: PageInfoRequest }> = await getClaimerSearch(searchCondition, pageInfo);
      if (response.success) {
        const claims = response.data.pageData.map(mapClaimToRequest);
        setApiData(claims);
        setTotalItems(response.data.pageInfo.totalItems || 0);
      } else {
        console.warn('API returned no data for this search:', searchCondition);
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setCurrentPage(1);
    setSearchText(value);
  };

  useEffect(() => {
    fetchClaims();
  }, [currentPage, pageSize, statusFilter, searchText]);

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

  const handlePageChange = (page: number, newPageSize?: number) => {
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status === "All" ? null : status);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-orange-100 shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Claim Request Management</h1>
      <TableRequest
        apiData={apiData}
        totalItems={totalItems}
        loading={loading}
        pagination={{ currentPage, pageSize, onPageChange: handlePageChange }}
        filter={{ statusFilter, onStatusChange: handleStatusChange }}
        search={{ searchText, onSearch: handleSearch }}
        actions={{ onEdit: handleEdit, onDelete: handleDelete }}
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