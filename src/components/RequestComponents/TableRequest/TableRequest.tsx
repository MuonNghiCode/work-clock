import React, { useState } from 'react';
import { Button, Pagination, Modal } from 'antd';
import { Trash, Edit, UserCheck } from 'lucide-react';

interface ClaimRequest {
  key: string;
  claimname: string;
  project: string; 
  start_date: string;
  end_date: string;
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
  actions: { onEdit: (record: ClaimRequest) => void; onDelete: (record: ClaimRequest) => void };
}

const TableRequest: React.FC<TableRequestProps> = ({
  apiData,
  totalItems,
  loading,
  pagination,
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
    <div className="request-container">
      {/* Use flex-col to stack elements vertically */}
      <div className="request-content flex flex-col">
        <div className="request-header mb-4">
          <table className="request-table min-w-full border-separate border-spacing-y-2.5">
            <thead className="request-table-header bg-gradient-to-r from-[#FEB78A] to-[#FF914D] h-[70px] text-lg text-white rounded-t-lg">
              <tr>
                <th className="request-table-header-cell px-4 py-2 rounded-tl-2xl">Claim Name</th>
                <th className="request-table-header-cell px-4 py-2 border-l-2 border-white">Start Date</th>
                <th className="request-table-header-cell px-4 py-2 border-l-2 border-white">End Date</th>
                <th className="request-table-header-cell px-4 py-2 border-l-2 border-white">Total Hours</th>
                <th className="request-table-header-cell px-4 py-2 border-l-2 border-white">Status</th>
                <th className="request-table-header-cell px-4 py-2 border-l-2 border-white rounded-tr-2xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="request-table-loading text-center py-4">Loading...</td></tr>
              ) : apiData.length > 0 ? (
                apiData.map(item => (
                  <tr
                    key={item.key}
                    className="request-table-row h-[70px] bg-white text-center hover:shadow-brand-orange rounded-2xl cursor-pointer"
                    onClick={() => handleRowClick(item)}
                  >
                    <td className="request-table-cell px-4 py-2 rounded-l-2xl">{item.claimname}</td>
                    <td className="request-table-cell px-4 py-2">{item.start_date}</td>
                    <td className="request-table-cell px-4 py-2">{item.end_date}</td>
                    <td className="request-table-cell px-4 py-2">
                      <div className="request-table-hours flex flex-col items-center">
                        <span className="text-gray-700">{`(${item.timeFrom}-${item.timeTo})`}</span>
                        <span className="font-semibold text-[#FF914D]">{item.totalHours} hours</span>
                      </div>
                    </td>
                    <td className="request-table-cell px-4 py-2">
                      <span className={`font-semibold ${getStatusColor(item.status)}`}>{item.status}</span>
                    </td>
                    <td className="request-table-cell px-4 py-2 rounded-r-2xl">
                      <div className="request-table-actions flex justify-center gap-2">
                        {item.status === 'Pending Approval' ? (
                          <Button className="!border-none" onClick={e => { e.stopPropagation(); actions.onDelete(item); }} disabled={loading}>
                            <Trash size={24} color="red" strokeWidth={3} className="hover:bg-red-200" />
                          </Button>
                        ) : item.status !== 'Approved' && item.status !== 'Rejected' && item.status !== 'Canceled' && item.status !== 'Paid' && (
                          <>
                            <Button className="!border-none" onClick={e => { e.stopPropagation(); actions.onEdit(item); }} disabled={loading}>
                              <Edit size={24} color="#FF914D" strokeWidth={3} className="request-edit-icon hover:bg-orange-200" />
                            </Button>
                            <Button className="!border-none" onClick={e => { e.stopPropagation(); actions.onDelete(item); }} disabled={loading}>
                              <Trash size={24} color="red" strokeWidth={3} className="request-delete-icon hover:bg-red-200" />
                            </Button>
                            <Button className="!border-none" onClick={e => e.stopPropagation()} disabled={loading}>
                              <UserCheck size={24} color="green" strokeWidth={3} className="request-user-icon hover:bg-green-200" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="request-table-no-data text-center py-4">No data available</td></tr>
              )}
            </tbody>
          </table>

          {/* Pagination below the table, centered */}
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
        </div>

        <Modal
          title="Claim Details"
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={<Button onClick={handleModalClose}>Close</Button>}
          className="request-modal"
        >
          {selectedClaim ? (
            <div className="request-modal-content grid grid-cols-2 gap-4">

              <div>
                <p><strong>ID:</strong> {selectedClaim.key}</p>
                <p><strong>Claim Name:</strong> {selectedClaim.claimname}</p>
                <p><strong>Project:</strong> {selectedClaim.project}</p>
                <p><strong>Status:</strong> {selectedClaim.status}</p>
              </div>

              <div>
                <p><strong>Start Date:</strong> {selectedClaim.start_date}</p>
                <p><strong>End Date:</strong> {selectedClaim.end_date}</p>
                <p><strong>Time From:</strong> {selectedClaim.timeFrom}</p>
                <p><strong>Time To:</strong> {selectedClaim.timeTo}</p>
                <p><strong>Total Hours:</strong> {selectedClaim.totalHours} hours</p>
                
              </div>
            </div>
          ) : (
            <p className="request-modal-no-data">No data available</p>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default TableRequest;