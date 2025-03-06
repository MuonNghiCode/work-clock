import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Tag } from 'antd';
import EditRequestModal from '../../components/RequestComponents/EditRequestModal/EditRequestModal';
import DeleteRequestModal from '../../components/RequestComponents/DeleteRequestModal/DeleteRequestModal';
import TableRequest from '../../components/RequestComponents/TableRequest/TableRequest';
import { getClaimerSearch } from '../../services/claimService';
import { ClaimItem, SearchCondition, PageInfoRequest } from '../../types/ClaimType';
import { ResponseModel } from '../../models/ResponseModel';
import { debounce } from 'lodash';
import { GetProps } from 'antd/es/_util/type';
import { CheckOutlined } from "@ant-design/icons";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

interface ClaimRequest {
  key: string;
  claimname: string;
  project: string;
  start_date: string; // "DD/MM/YYYY"
  end_date: string;   // "DD/MM/YYYY"
  totalHours: string;
  timeFrom: string;
  timeTo: string;
  status: string;
}

const RequestPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ClaimRequest | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<ClaimRequest | null>(null);
  const [form] = Form.useForm();
  const [apiData, setApiData] = useState<ClaimRequest[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const mapClaimToRequest = (item: ClaimItem): ClaimRequest => ({
    key: item._id,
    claimname: item.claim_name || 'Unnamed Claim',
    project: item.project_info?.project_name || 'Unknown',
    start_date: new Date(item.claim_start_date).toLocaleDateString('vi-VN'), // "DD/MM/YYYY"
    end_date: new Date(item.claim_end_date).toLocaleDateString('vi-VN'),     // "DD/MM/YYYY"
    timeFrom: new Date(item.claim_start_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    timeTo: new Date(item.claim_end_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    totalHours: item.total_work_time?.toString() || '0',
    status: item.claim_status || 'Unknown',
  });

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const searchCondition: SearchCondition = {
        keyword: searchText,
        claim_status: statusFilter === 'All' || !statusFilter ? '' : statusFilter,
        claim_start_date: '',
        claim_end_date: '',
        is_delete: false,
      };
      const pageInfo: PageInfoRequest = { pageNum: currentPage, pageSize };

      const response: ResponseModel<{ pageData: ClaimItem[], pageInfo: PageInfoRequest }> = await getClaimerSearch(searchCondition, pageInfo);
      if (response.success) {
        const claims = response.data.pageData.map(mapClaimToRequest);
        claims.sort((a, b) => {
          const startDateDiff = new Date(a.start_date.split('/').reverse().join('-')).getTime() - new Date(b.start_date.split('/').reverse().join('-')).getTime();
          if (startDateDiff !== 0) return startDateDiff;
          return new Date(a.end_date.split('/').reverse().join('-')).getTime() - new Date(b.end_date.split('/').reverse().join('-')).getTime();
        });
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

  const handleSearch = useCallback(
    debounce((value: string) => {
      setCurrentPage(1);
      setSearchText(value);
    }, 1000),
    []
  );

  const onSearch: SearchProps['onSearch'] = (value) => {
    handleSearch(value);
  };

  useEffect(() => {
    fetchClaims();
  }, [currentPage, pageSize, statusFilter, searchText]);

  const handleEdit = (record: ClaimRequest) => {
    setEditingRecord(record);
    setIsEditModalOpen(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalOpen(false);
    form.resetFields();
  };

  const handleEditModalOk = async () => {
    try {
      if (!editingRecord) throw new Error('No record being edited');
      setIsEditModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Error in handleEditModalOk:', error);
    }
  };

  const handleDelete = (record: ClaimRequest) => {
    setDeletingRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalOk = () => {
    if (deletingRecord) {
      setApiData((prev) => prev.filter((item) => item.key !== deletingRecord.key));
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
      <div className="flex justify-between items-center mb-4">
        <div>
          {["All", "Draft", "Pending Approval", "Approved", "Rejected", "Canceled", "Paid"].map((status) => (
            <Tag
              key={status}
              color={statusFilter === status || (status === "All" && !statusFilter) ? "#ff914d" : "default"}
              onClick={() => handleStatusChange(status)}
              className="cursor-pointer !px-2 !py-1 !font-squada !text-lg !rounded-lg"
            >
              {(statusFilter === status || (status === "All" && !statusFilter)) && <CheckOutlined />} {status}
            </Tag>
          ))}
        </div>
        <div className="w-[250px] height-[48px] overflow-hidden rounded-full border-[1px] border-gray-300 bg-white !font-squada">
          <Search
            placeholder="Search claim name"
            onSearch={onSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
            size="large"
            className="custom-search pl-1"
            variant="borderless"
          />
        </div>
      </div>
      <TableRequest
        apiData={apiData}
        totalItems={totalItems}
        loading={loading}
        pagination={{ currentPage, pageSize, onPageChange: handlePageChange }}
        actions={{ onEdit: handleEdit, onDelete: handleDelete }}
      />
      <EditRequestModal
        isOpen={isEditModalOpen}
        onCancel={handleEditModalCancel}
        onOk={handleEditModalOk}
        editingRecord={editingRecord}
        claimId={editingRecord?.key || ''}
        refreshData={fetchClaims}
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