import React, { useState } from "react";
import { Button, Pagination, Tag, Input } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { ClaimRequest } from "../../model/ClaimRequest";
import { CircleCheck, CircleX, RotateCcw } from "lucide-react";
import { GetProps } from "antd/lib/_util/type";
import ClaimRequestDetail from "./ClaimRequestDetail";
import ConfirmModal from "../../components/ConfirmModal.tsx/ConfirmModal";
type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;
interface DataProps {
  data: ClaimRequest[];
}

const TableApproval: React.FC<DataProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showApprovalDetail, setShowApprovalDetail] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status === "All" ? null : status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const filteredData = statusFilter
    ? data.filter((item) => item.status === statusFilter)
    : data;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  const statusTags = [
    "All",
    "Pending",
    "Return",
    "Approval",
    "Reject",
  ];

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  const handleShowApprovalDetail = () => {
    setShowApprovalDetail(true);
    console.log("Show Approval Detail");
  };

  const handleApprove = () => {
    setMessage("Confirm Approve this request?");
    setShowConfirmModal(true);
    console.log("Approve");
  };

  const handleReject = () => {
    setMessage("ConfirmReject this request?");
    setShowConfirmModal(true);
    console.log("Reject");
  };

  const handleReturn = () => {
    setMessage("Return reason?");
    setShowConfirmModal(true);
    console.log("Return");
  };

  const handleClose = () => {
    setShowApprovalDetail(false);
    setShowConfirmModal(false);
    console.log("Close Approval Detail  ");
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          {statusTags.map((status) => (
            <Tag
              key={status}
              color={statusFilter === status || (status === "All" && statusFilter === null) ? "blue" : "default"}
              onClick={() => handleStatusChange(status)}
              className="cursor-pointer !px-3 !py-1 !font-squada !text-lg !rounded-lg"
            >
              {(statusFilter === status || (status === "All" && statusFilter === null)) && <CheckOutlined />} {status}
            </Tag>
          ))}
        </div>
        <div className="w-[250px] height-[48px] overflow-hidden rounded-full border-[1px] border-gray-300 bg-white !font-squada">
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            style={{ width: 250 }}
            size="large"
            className="custom-search"
            variant="borderless"
          />
        </div>
      </div>
      <table className="min-w-full !border-separate border-spacing-y-2.5  border-gray-300 text-black border-0">
        <thead className="bg-brand-grandient h-[100px] text-2xl">
          <tr className="bg-gradient from-[FEB78A] to-[FF914D]">
            <th className="border-white px-4 py-2">Project</th>
            <th className="border-l-2 border-white px-4 py-2">Claimer</th>
            <th className="border-l-2 border-white px-4 py-2">Time</th>
            <th className="border-l-2 border-white px-4 py-2">Status</th>
            <th className="border-l-2 border-white px-4 py-2">Date Create</th>
            <th className="border-l-2 border-white px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody className="w-full text-[20px]">
          {currentData.map((item, index) => (
            <tr
              onClick={handleShowApprovalDetail}
              key={index}
              className="h-[100px] bg-white border-black !border-2 !rounded-lg text-center border-collapse shadow-lg hover:shadow-2xl"
            >
              <td className="px-4 py-2 border-l-2 border-t-2 border-b-2 rounded-l-lg">
                {item.projectName}
              </td>
              <td className="px-4 py-2 border-t-2 border-b-2">
                {item.staffName}
              </td>
              <td className="px-4 py-2 border-t-2 border-b-2">
                {item.totalWorkingHour}
              </td>
              <td className="px-4 py-2 border-t-2 border-b-2">{item.status}</td>
              <td className="px-4 py-2 border-t-2 border-b-2">
                {item.dateCreate}
              </td>
              <td
                className="action px-4 py-2 border-r-2 border-t-2 border-b-2 rounded-r-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-full flex justify-center items-center space-x-12">
                  <div className="flex justify-center items-center w-12 h-12 overflow-hidden rounded-full">
                    <Button className="!bg-none !border-none">
                      <span>
                        <CircleCheck
                          size={48}
                          color="green"
                          strokeWidth={3}
                          onClick={handleApprove}
                          className="hover:bg-green-300 overflow-hidden rounded-full"
                        />
                      </span>
                    </Button>
                  </div>
                  <div className="flex justify-center items-center w-12 h-12 overflow-hidden rounded-full">
                    <Button className="!bg-none !border-none">
                      <span>
                        <CircleX
                          size={48}
                          color="red"
                          strokeWidth={3}
                          onClick={handleReject}
                          className="hover:bg-red-300 overflow-hidden rounded-full"
                        />
                      </span>
                    </Button>
                  </div>
                  <div className="flex justify-center items-center w-12 h-12 overflow-hidden rounded-full">
                    <Button className="!bg-none !border-none">
                      <span>
                        <RotateCcw
                          size={48}
                          color="blue"
                          strokeWidth={3}
                          onClick={handleReturn}
                          className="hover:bg-blue-300 overflow-hidden rounded-full"
                        />
                      </span>
                    </Button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredData.length}
          onChange={handlePageChange}
          showSizeChanger
          onShowSizeChange={handlePageChange}
        />
      </div>
      <ClaimRequestDetail visible={showApprovalDetail} onClose={handleClose} />
      <ConfirmModal
        visible={showConfirmModal}
        onClose={handleClose}
        message={message}
      />
    </>
  );
};

export default TableApproval;
