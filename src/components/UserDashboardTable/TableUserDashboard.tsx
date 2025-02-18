import React, { useState } from "react";
import { Pagination, Tag } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { ClaimRequest } from "../../types/ClaimRequest";
import ClaimRequestDetail from "../../pages/ApprovalPage/ClaimRequestDetail";

interface DataProps {
  data: ClaimRequest[];
}

const TableUserDashboard: React.FC<DataProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showApprovalDetail, setShowApprovalDetail] = useState<boolean>(false);

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
  const statusTags = ["All", "Pending", "Approval", "Reject", "Return", "Paid"];

  const handleShowApprovalDetail = () => {
    setShowApprovalDetail(true);
  };

  const handleClose = () => {
    setShowApprovalDetail(false);
  };

  // Tính toán các thuộc tính tổng hợp
  const totalWorkingHours = data.reduce(
    (acc, item) => acc + item.totalWorkingHour,
    0
  );

  const totalClaimRequests = data.length;
  const totalAmountReceived = data.reduce(
    (acc, item) => acc + (item.amountReceived || 0),
    0
  );

  return (
    <>
      <div className="flex items-start justify-center gap-12">
        <div>
          <div className="flex flex-wrap gap-4 mb-4">
            {statusTags.map((status) => (
              <Tag
                key={status}
                color={statusFilter === status ? "blue" : "default"}
                onClick={() => handleStatusChange(status)}
                className="cursor-pointer !px-3 !py-1 !font-squada !text-lg !rounded-lg"
              >
                {statusFilter === status && <CheckOutlined />} {status}
              </Tag>
            ))}
          </div>
          <table className="w-[750px] !border-separate border-spacing-y-2.5  border-gray-300 text-black border-0">
            <thead className="bg-brand-gradient h-[100px] text-2xl">
              <tr className="bg-gradient from-[FEB78A] to-[FF914D]">
                <th className="px-4 py-2 border-white">Project</th>
                <th className="px-4 py-2 border-l-2 border-white">
                  Date Create
                </th>
                <th className="px-4 py-2 border-l-2 border-white">Day</th>
                <th className="px-4 py-2 border-l-2 border-white">Status</th>
                <th className="px-4 py-2 border-l-2 border-white">
                  Total No. of Hours
                </th>
              </tr>
            </thead>
            <tbody className="w-full text-[20px]">
              {currentData.map((item, index) => (
                <tr
                  onClick={handleShowApprovalDetail}
                  key={index}
                  className="h-[100px] bg-white border-black !border-2 !rounded-lg text-center border-collapse shadow-lg hover:shadow-2xl"
                >
                  <td className="px-4 py-2 border-t-2 border-b-2 border-l-2 rounded-l-lg">
                    {item.projectName}
                  </td>
                  <td className="px-4 py-2 border-t-2 border-b-2">
                    {item.dateCreate}
                  </td>
                  <td className={`px-4 py-2 border-t-2 border-b-2`}>
                    {item.claimTable[0].day}
                  </td>
                  <td className={`px-4 py-2 border-t-2 border-b-2 `}>
                    <span
                      className={`${
                        item.status === "Approval"
                          ? "text-green-500"
                          : item.status === "Reject"
                          ? "text-red-500"
                          : item.status === "Pending"
                          ? "text-yellow-500"
                          : item.status === "Return"
                          ? "text-purple-500"
                          : item.status === "Paid"
                          ? "text-blue-500"
                          : ""
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-t-2 border-b-2 border-r-2 rounded-r-lg">
                    {item.claimTable[0].totalNoOfHours}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredData.length}
              onChange={handlePageChange}
              // showSizeChanger
              // onShowSizeChange={handlePageChange}
            />
          </div>
        </div>
        <div className="flex items-center justify-around border-2 rounded-[10px]  w-[500px]  ">
          <div className="flex flex-col gap-4 text-2xl">
            <h2 className="p-5 bg-[#FF914D] bg-clip-padding rounded-tl-[8px] ">
              Total Working Hours:
            </h2>
            <p className="flex justify-center">{totalWorkingHours} Hours</p>
          </div>
          <div className="flex flex-col gap-4 text-2xl">
            <h2 className="p-5 bg-[#FF914D] bg-clip-padding">
              Total Claim Request:
            </h2>
            <p className="flex justify-center">{totalClaimRequests}</p>
          </div>
          <div className="flex flex-col gap-4 text-2xl">
            <h2 className="p-5 bg-[#FF914D] bg-clip-padding rounded-tr-[8px]">
              Total Amount Paid:
            </h2>
            <p className="flex justify-center">${totalAmountReceived}</p>
          </div>
        </div>
      </div>
      <ClaimRequestDetail visible={showApprovalDetail} onClose={handleClose} />
    </>
  );
};

export default TableUserDashboard;
