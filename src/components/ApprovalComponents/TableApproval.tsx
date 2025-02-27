import React, { useState } from "react";
import { Button, Pagination, Tag, Input } from "antd";
import { ClaimRequest } from "../../types/ClaimRequest";
import { GetProps } from "antd/lib/_util/type";
import ClaimRequestDetail from "./ClaimRequestDetail";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import Icons from "../icon";

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
    setCurrentPage(1);
  };

  const filteredData = statusFilter
    ? data.filter((item) => item.status === statusFilter)
    : data;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  const statusTags = ["All", "Pending", "Canceled", "Approved", "Rejected"];

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
    setMessage("Confirm Reject this request?");
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
    console.log("Close Approval Detail");
  };

  const handleStatusChangeHTML = (status: string) => {
    switch (status) {
      case "Pending":
        return <span className="text-gray-300">Pending</span>;
      case "Canceled":
        return <span className="text-blue-500">Canceled</span>;
      case "Approved":
        return <span className="text-green-500">Approved</span>;
      case "Rejected":
        return <span className="text-red-500">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          {statusTags.map((status) => (
            <Tag
              key={status}
              color={
                statusFilter === status ||
                  (status === "All" && statusFilter === null)
                  ? "#ff914d"
                  : "default"
              }
              onClick={() => handleStatusChange(status)}
              className="cursor-pointer !px-2 !py-1 !font-squada !text-lg !rounded-lg"
            >
              {(statusFilter === status ||
                (status === "All" && statusFilter === null)) && (
                  <Icons.Check className="inline-flex" />
                )}{" "}
              {status}
            </Tag>
          ))}
        </div>
        <div className="w-[250px] height-[48px] overflow-hidden rounded-full border-[1px] border-gray-300 bg-white !font-squada">
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            style={{ width: 250 }}
            size="large"
            className="custom-search pl-1"
            variant="borderless"
          />
        </div>
      </div>
      <table className="min-w-full !border-separate border-spacing-y-2.5 text-black border-0">
        <thead className="bg-brand-grandient  h-[70px] text-lg text-white !rounded-t-lg">
          <tr className="bg-gradient from-[FEB78A] to-[FF914D]">
            <th className="border-white px-4 py-2 !rounded-tl-2xl">Project</th>
            <th className="border-l-2 border-white px-4 py-2">Claimer</th>
            <th className="border-l-2 border-white px-4 py-2">Time</th>
            <th className="border-l-2 border-white px-4 py-2">Status</th>
            <th className="border-l-2 border-white px-4 py-2">Date Create</th>
            <th className="border-l-2 border-white px-4 py-2 !rounded-tr-2xl">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="w-full">
          {currentData.map((item, index) => (
            <tr
              onClick={handleShowApprovalDetail}
              key={index}
              className="h-[70px] bg-white overflow-hidden text-center border-collapse  hover:shadow-brand-orange !rounded-2xl "
            >
              <td className="px-4 py-2  rounded-l-2xl">
                {item.projectName}
              </td>
              <td className="px-4 py-2">
                {item.staffName}
              </td>
              <td className="px-4 py-2 ">
                {item.totalWorkingHour}
              </td>
              <td className="px-4 py-2 ">
                {handleStatusChangeHTML(item.status)}
              </td>
              <td className="px-4 py-2 ">
                {item.dateCreate}
              </td>
              <td
                className="action px-4 py-2 rounded-r-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-full flex justify-center gap-2 items-center space-x-2">
                  <div className="flex justify-center items-center w-10 h-10 overflow-hidden ">
                    <Button className="!bg-none !border-none">
                      <span className="hover:scale-110">
                        <Icons.Approve
                          color="green"
                          // strokeWidth={3}
                          onClick={handleApprove}
                          className="w-10 h-10"
                        />
                      </span>
                    </Button>
                  </div>
                  <div className="flex justify-center items-center w-10 h-10 overflow-hidden ">
                    <Button className="!bg-none !border-none">
                      <span className="hover:scale-110">
                        <Icons.Reject
                          color="red"
                          // strokeWidth={3}
                          onClick={handleReject}
                          className="w-10 h-10"
                        />
                      </span>
                    </Button>
                  </div>
                  <div className="flex justify-center items-center w-10 h-10 overflow-hidden ">
                    <Button className="!bg-none !border-none">
                      <span className="hover:scale-110">
                        <Icons.Return
                          color="blue"
                          // strokeWidth={3}
                          onClick={handleReturn}
                          className="w-10 h-10"
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
          className="!font-squada flex justify-end "
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
        onConfirm={() => {
          console.log("Confirm");
        }}
      />
    </>
  );
};

export default TableApproval;
