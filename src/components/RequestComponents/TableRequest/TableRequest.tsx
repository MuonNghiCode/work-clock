import React, { useState } from 'react';
import { Button, Tag, Input, Pagination, Modal } from 'antd';
import { Trash, Edit, UserCheck } from 'lucide-react';
import { CheckOutlined } from "@ant-design/icons";

const STATUS_TAGS = ["All", "Draft", "Pending Approval", "Approved", "Rejected", "Canceled", "Paid"];

interface ClaimRequest {
  key: string;
  claimname: string;
  project: string; // Thêm project vào interface
  date: string;
  totalHours: string;
  timeFrom: string;
  timeTo: string;
  status: string;
}

interface TableRequestProps {
  apiData: ClaimRequest[];
  totalItems: number;
  loading: boolean;
  pagination: { currentPage: number; pageSize: number; onPageChange: (page: number, pageSize?: number) => void };
  filter: { statusFilter: string | null; onStatusChange: (status: string) => void };
  search: { searchText: string; onSearch: (value: string) => void };
  actions: { onEdit: (record: ClaimRequest) => void; onDelete: (record: ClaimRequest) => void };
}

const TableRequest: React.FC<TableRequestProps> = ({
  apiData,
  totalItems,
  loading,
  pagination,
  filter,
  search,
  actions
}) => {
  const [selectedClaim, setSelectedClaim] = useState<ClaimRequest | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleRowClick = (record: ClaimRequest) => {
    setSelectedClaim(apiData.find(item => item.key === record.key) || null);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedClaim(null);
  };

  const getStatusColor = (status: string) => ({
    'Approved': 'text-green-600',
    'Rejected': 'text-red-600',
    'Draft': 'text-gray-600',
    'Pending Approval': 'text-yellow-600',
    'Canceled': 'text-purple-600',
    'Paid': 'text-blue-600'
  }[status] || 'text-gray-600');

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          {STATUS_TAGS.map(status => (
            <Tag
              key={status}
              color={filter.statusFilter === status || (status === "All" && !filter.statusFilter) ? "#ff914d" : "default"}
              onClick={() => filter.onStatusChange(status)}
              className="cursor-pointer !px-2 !py-1 !font-squada !text-lg !rounded-lg"
            >
              {(filter.statusFilter === status || (status === "All" && !filter.statusFilter)) && <CheckOutlined />} {status}
            </Tag>
          ))}
        </div>
        <Input.Search
          placeholder="Search claim name"
          onSearch={search.onSearch}
          onChange={e => search.onSearch(e.target.value)}
          value={search.searchText}
          style={{ width: 250 }}
          size="large"
          className="custom-search rounded-full border-[1px] border-gray-300"
          allowClear
        />
      </div>

      <table className="min-w-full !border-separate border-spacing-y-2.5">
        <thead className="bg-gradient-to-r from-[#FEB78A] to-[#FF914D] h-[70px] text-lg text-white rounded-t-lg">
          <tr>
            <th className="px-4 py-2 rounded-tl-2xl">Claim Name</th>
            <th className="px-4 py-2 border-l-2 border-white">Date</th>
            <th className="px-4 py-2 border-l-2 border-white">Total Hours</th>
            <th className="px-4 py-2 border-l-2 border-white">Status</th>
            <th className="px-4 py-2 border-l-2 border-white rounded-tr-2xl">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="text-center py-4">Loading...</td></tr>
          ) : apiData.length > 0 ? (
            apiData.map(item => (
              <tr
                key={item.key}
                className="h-[70px] bg-white text-center hover:shadow-brand-orange rounded-2xl cursor-pointer"
                onClick={() => handleRowClick(item)}
              >
                <td className="px-4 py-2 rounded-l-2xl">{item.claimname}</td>
                <td className="px-4 py-2">{item.date}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-col items-center">
                    <span className="text-gray-700">{`(${item.timeFrom}-${item.timeTo})`}</span>
                    <span className="font-semibold text-[#FF914D]">{item.totalHours} hours</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <span className={`font-semibold ${getStatusColor(item.status)}`}>{item.status}</span>
                </td>
                <td className="px-4 py-2 rounded-r-2xl">
                  <div className="flex justify-center gap-2">
                    {item.status === 'Pending Approval' ? (
                      <Button className="!border-none" onClick={e => { e.stopPropagation(); actions.onDelete(item); }} disabled={loading}>
                        <Trash size={24} color="red" strokeWidth={3} className="hover:bg-red-200" />
                      </Button>
                    ) : item.status !== 'Approved' && item.status !== 'Rejected' && item.status !== 'Canceled' && item.status !== 'Paid' && (
                      <>
                        <Button className="!border-none" onClick={e => { e.stopPropagation(); actions.onEdit(item); }} disabled={loading}>
                          <Edit size={24} color="#FF914D" strokeWidth={3} className="hover:bg-orange-200" />
                        </Button>
                        <Button className="!border-none" onClick={e => { e.stopPropagation(); actions.onDelete(item); }} disabled={loading}>
                          <Trash size={24} color="red" strokeWidth={3} className="hover:bg-red-200" />
                        </Button>
                        <Button className="!border-none" onClick={e => e.stopPropagation()} disabled={loading}>
                          <UserCheck size={24} color="green" strokeWidth={3} className="hover:bg-green-200" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={5} className="text-center py-4">No data available</td></tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        <Pagination
          current={pagination.currentPage}
          pageSize={pagination.pageSize}
          total={totalItems}
          onChange={pagination.onPageChange}
          showSizeChanger
          pageSizeOptions={['5', '10', '20', '50']}
          disabled={loading}
        />
      </div>

      <Modal
        title="Claim Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={<Button onClick={handleModalClose}>Close</Button>}
      >
        {selectedClaim ? (
          <div>
            <p><strong>ID:</strong> {selectedClaim.key}</p>
            <p><strong>Claim Name:</strong> {selectedClaim.claimname}</p>
            <p><strong>Project:</strong> {selectedClaim.project}</p> {/* Thêm Project */}
            <p><strong>Date:</strong> {selectedClaim.date}</p>
            <p><strong>Time From:</strong> {selectedClaim.timeFrom}</p>
            <p><strong>Time To:</strong> {selectedClaim.timeTo}</p>
            <p><strong>Total Hours:</strong> {selectedClaim.totalHours} hours</p>
            <p><strong>Status:</strong> {selectedClaim.status}</p>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </Modal>
    </div>
  );
};

export default TableRequest;