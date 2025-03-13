import React, { useState } from "react";
import { Button, Pagination, Modal } from "antd";
import {
  Trash2,
  Edit2,
  UserCheck,
  X,
  User,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";
import CancelRequestModal from "../CancelRequestModal/CancelRequestModal";

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
  pagination: {
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number, pageSize?: number) => void;
  };
  actions: {
    onEdit: (record: ClaimRequest) => void;
    onDelete: (record: ClaimRequest) => void;
    onRequestApproval: (record: ClaimRequest) => void;
    onCancel: (record: ClaimRequest) => void;
  };
}

const TableRequest: React.FC<TableRequestProps> = ({
  apiData,
  totalItems,
  loading,
  pagination,
  actions,
}) => {
  const [selectedClaim, setSelectedClaim] = useState<ClaimRequest | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // State cho modal Cancel
  const [cancelingRecord, setCancelingRecord] = useState<ClaimRequest | null>(
    null
  ); // Record đang hủy

  const handleRowClick = (record: ClaimRequest) => {
    setSelectedClaim(apiData.find((item) => item.key === record.key) || null);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedClaim(null);
  };

  const handleCancelClick = (record: ClaimRequest) => {
    setCancelingRecord(record);
    setIsCancelModalOpen(true);
  };

  const handleCancelConfirm = () => {
    if (cancelingRecord) {
      actions.onCancel(cancelingRecord); // Gọi hàm onCancel từ props
    }
    setIsCancelModalOpen(false);
    setCancelingRecord(null);
  };

  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
    setCancelingRecord(null);
  };

  const getStatusColor = (status: string) =>
    ({
      Approved: "text-green-600",
      Rejected: "text-red-600",
      Draft: "text-gray-600",
      "Pending Approval": "text-yellow-600",
      Canceled: "text-purple-600",
      Paid: "text-blue-600",
    }[status] || "text-gray-600");

  return (
    <div className="request-container">
      <div className="request-content flex flex-col">
        <div className="request-header mb-4">
          <table className="request-table min-w-full border-separate border-spacing-y-2.5">
            <thead className="request-table-header bg-gradient-to-r from-[#FEB78A] to-[#FF914D] h-[70px] text-lg text-white rounded-t-lg">
              <tr>
                <th className="request-table-header-cell px-4 py-2 rounded-tl-2xl">
                  Claim Name
                </th>
                <th className="request-table-header-cell px-4 py-2 border-l-2 border-white">
                  Start Date
                </th>
                <th className="request-table-header-cell px-4 py-2 border-l-2 border-white">
                  End Date
                </th>
                <th className="request-table-header-cell px-4 py-2 border-l-2 border-white">
                  Total Hours
                </th>
                <th className="request-table-header-cell px-4 py-2 border-l-2 border-white">
                  Status
                </th>
                <th className="request-table-header-cell px-4 py-2 border-l-2 border-white rounded-tr-2xl">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="request-table-loading text-center py-4"
                  >
                    Loading...
                  </td>
                </tr>
              ) : apiData.length > 0 ? (
                apiData.map((item) => (
                  <tr
                    key={item.key}
                    className="request-table-row h-[70px] bg-white text-center hover:shadow-brand-orange rounded-2xl cursor-pointer"
                    onClick={() => handleRowClick(item)}
                  >
                    <td className="request-table-cell px-4 py-2 rounded-l-2xl">
                      {item.claimname}
                    </td>
                    <td className="request-table-cell px-4 py-2">
                      {item.start_date}
                    </td>
                    <td className="request-table-cell px-4 py-2">
                      {item.end_date}
                    </td>
                    <td className="request-table-cell px-4 py-2">
                      <div className="request-table-hours flex flex-col items-center">
                        <span className="text-gray-700">{`(${item.timeFrom}-${item.timeTo})`}</span>
                        <span className="font-semibold text-[#FF914D]">
                          {item.totalHours} hours
                        </span>
                      </div>
                    </td>
                    <td className="request-table-cell px-4 py-2">
                      <span
                        className={`font-semibold ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="request-table-cell px-4 py-2 rounded-r-2xl">
                      <div className="request-table-actions flex justify-center gap-2">
                        {item.status === "Pending Approval" ? (
                          <Button
                            className="!border-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelClick(item);
                            }}
                            disabled={loading}
                            title="Cancel Request"
                          >
                            <Trash2 size={18} color="red" />
                          </Button>
                        ) : (
                          item.status !== "Approved" &&
                          item.status !== "Rejected" &&
                          item.status !== "Canceled" &&
                          item.status !== "Paid" && (
                            <>
                              <Button
                                className="!border-none"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  actions.onEdit(item);
                                }}
                                disabled={loading}
                                title="Edit Request"
                              >
                                <Edit2 size={18} color="#50ab9a" />
                              </Button>
                              <Button
                                className="!border-none"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  actions.onRequestApproval(item);
                                }}
                                disabled={loading || item.status !== "Draft"}
                                title="Request Approval"
                              >
                                <UserCheck size={18} color="green" />
                              </Button>
                              <Button
                                className="!border-none"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelClick(item);
                                }}
                                disabled={loading}
                                title="Cancel Request"
                              >
                                <Trash2 size={18} color="red" />
                              </Button>
                            </>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="request-table-no-data text-center py-4"
                  >
                    No data available
                  </td>
                </tr>
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
              pageSizeOptions={["3", "5", "10", "20", "50"]}
              disabled={loading}
            />
          </div>
        </div>

        <Modal
          title=""
          open={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          className="request-modal"
          closeIcon={null}
          width={800}
        >
          {selectedClaim ? (
            <div className="p-8 bg-gray-50 rounded-xl">
              {/* Giữ nguyên phần hiển thị chi tiết claim */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-[#FF9447]">
                  Claim Details
                </h2>
                <button
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-10">
                <div className="flex flex-col">
                  <div className="bg-white rounded-lg p-6 shadow-sm h-full">
                    <h4 className="text-lg font-bold text-[#FF9447] mb-4 border-b pb-2">
                      Claim Information
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <User
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Claim Name:
                        </span>
                        <span className="w-2/3 text-gray-800 font-semibold truncate">
                          {selectedClaim.claimname}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Project:
                        </span>
                        <span className="w-2/3 text-gray-800 font-semibold truncate">
                          {selectedClaim.project}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Start Date:
                        </span>
                        <span className="w-2/3 text-gray-800 font-semibold">
                          {selectedClaim.start_date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-white rounded-lg p-6 shadow-sm h-full">
                    <h4 className="text-lg font-bold text-[#FF9447] mb-4 border-b pb-2">
                      Time and Status
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Calendar
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          End Date:
                        </span>
                        <span className="w-2/3 text-gray-800 font-semibold">
                          {selectedClaim.end_date}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Time From:
                        </span>
                        <span className="w-2/3 text-gray-800 font-semibold">
                          {selectedClaim.timeFrom}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Time To:
                        </span>
                        <span className="w-2/3 text-gray-800 font-semibold">
                          {selectedClaim.timeTo}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Total Hours:
                        </span>
                        <span className="w-2/3 text-gray-800 font-semibold">
                          {selectedClaim.totalHours} hours
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle
                          size={18}
                          className="text-[#FF9447] mr-3 flex-shrink-0"
                        />
                        <span className="w-1/3 font-medium text-gray-600">
                          Status:
                        </span>
                        <span className="w-2/3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              selectedClaim.status === "Approved"
                                ? "bg-green-50 text-green-600"
                                : selectedClaim.status === "Rejected"
                                ? "bg-red-50 text-red-600"
                                : selectedClaim.status === "Pending Approval"
                                ? "bg-yellow-50 text-yellow-600"
                                : selectedClaim.status === "Canceled"
                                ? "bg-purple-50 text-purple-600"
                                : selectedClaim.status === "Paid"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-gray-50 text-gray-600"
                            }`}
                          >
                            {selectedClaim.status}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleModalClose}
                  className="px-6 py-2 bg-[#FFB17A] text-white rounded-md hover:bg-[#FF9447] transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <p className="request-modal-no-data">No data available</p>
          )}
        </Modal>

        <CancelRequestModal
          isOpen={isCancelModalOpen}
          onOk={handleCancelConfirm}
          onCancel={handleCancelModalClose}
          cancelingRecord={cancelingRecord}
        />
      </div>
    </div>
  );
};

export default TableRequest;
