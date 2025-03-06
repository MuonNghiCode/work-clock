import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Pagination, Tag, Input } from "antd";
import { ClaimRequest } from "../../types/ClaimRequest";
import { GetProps } from "antd/lib/_util/type";
import ClaimRequestDetail from "./ClaimRequestDetail";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import Icons from "../icon";
import { searchApprovalClaims } from "../../services/approvalService";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

const TableApproval: React.FC = () => {
  const [approvalData, setApprovalData] = useState<ClaimRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("Pending Approval");
  const [showApprovalDetail, setShowApprovalDetail] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(0);

  const prevPageRef = useRef(currentPage);
  const prevPageSizeRef = useRef(pageSize);
  const prevStatusFilterRef = useRef(statusFilter);
  const prevSearchTermRef = useRef(searchTerm);

  const fetchApprovalData = async () => {
    const request = {
      searchCondition: {
        keyword: searchTerm,
        claim_status: statusFilter,
        claim_start_date: "",
        claim_end_date: "",
        is_delete: false,
      },
      pageInfo: {
        pageNum: currentPage,
        pageSize: pageSize,
      },
    };
    try {
      const response = await searchApprovalClaims(request);
      if (response.success) {
        setApprovalData(response.data.pageData);
        setTotalItems(response.data.pageInfo.totalItems || 0);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchApprovalData();
  }, []);

  useEffect(() => {
    if (
      prevPageRef.current !== currentPage ||
      prevPageSizeRef.current !== pageSize ||
      prevStatusFilterRef.current !== statusFilter ||
      prevSearchTermRef.current !== searchTerm
    ) {
      fetchApprovalData();
      prevPageRef.current = currentPage;
      prevPageSizeRef.current = pageSize;
      prevStatusFilterRef.current = statusFilter;
      prevSearchTermRef.current = searchTerm;
    }
  }, [currentPage, pageSize, statusFilter, searchTerm]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const statusTags = ["Pending Approval", "Approved", "Rejected", "Canceled"];

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 1000),
    []
  );

  const onSearch: SearchProps["onSearch"] = (value) => {
    handleSearch(value);
  };

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
      case "Pending Approval":
        return <span className="text-gray-300">Pending Approval</span>;
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

  const formatDateTime = (date: string) => {
    const dateTime = new Date(date);
    return `${dateTime.toLocaleDateString('vi-VN')} - ${dateTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
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
                  (status === "Pending Approval" && statusFilter === "")
                  ? "#ff914d"
                  : "default"
              }
              onClick={() => handleStatusChange(status)}
              className="cursor-pointer !px-2 !py-1 !font-squada !text-lg !rounded-lg"
            >
              {(statusFilter === status ||
                (status === "Pending Approval")) && (
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
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
            size="large"
            className="custom-search pl-1"
            variant="borderless"
          />
        </div>
      </div>
      <table className="min-w-full !border-separate border-spacing-y-2.5 text-black border-0 ">
        <thead className="bg-brand-grandient h-[70px] text-lg text-white !rounded-t-lg">
          <tr className="bg-gradient from-[FEB78A] to-[FF914D] w-full">
            <th className="border-white px-4 py-2 !rounded-tl-2xl">Claim Name</th>
            <th className="border-l-2 border-white px-4 py-2">Claimer</th>
            <th className="border-l-2 border-white px-4 py-2">Time</th>
            <th className="border-l-2 border-white px-4 py-2">Status</th>
            {statusFilter === "Pending Approval" ? (<>
              <th className="border-l-2 border-white px-4 py-2">Date Create</th>
              <th className="border-l-2 border-white px-4 py-2 !rounded-tr-2xl">Action</th>
            </>
            ) : (
              <th className="border-l-2 border-white px-4 py-2 !rounded-tr-2xl">Date Create</th>
            )}
          </tr>
        </thead>
        <tbody className="w-full">
          {approvalData.map((item) => (
            <tr
              onClick={handleShowApprovalDetail}
              key={item._id}
              className="h-[70px] bg-white overflow-hidden text-center border-collapse hover:shadow-brand-orange !rounded-2xl"
            >
              <td className="px-4 py-2 rounded-l-2xl">{item.claim_name}</td>
              <td className="px-4 py-2">{item.staff_name}</td>
              <td className="px-4 py-2">{formatDateTime(item.claim_start_date)}</td>
              <td className="px-4 py-2">{handleStatusChangeHTML(item.claim_status)}</td>
              <td className="px-4 py-2">{formatDateTime(item.created_at)}</td>
              {item.claim_status === "Pending Approval" ? (
                <td
                  className="action px-4 py-2 rounded-r-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-full flex justify-center gap-2 items-center space-x-2">
                    <div className="flex justify-center items-center w-10 h-10 overflow-hidden">
                      <Button className="!bg-none !border-none">
                        <span className="hover:scale-110">
                          <Icons.Approve
                            color="green"
                            onClick={handleApprove}
                            className="w-10 h-10"
                          />
                        </span>
                      </Button>
                    </div>
                    <div className="flex justify-center items-center w-10 h-10 overflow-hidden">
                      <Button className="!bg-none !border-none">
                        <span className="hover:scale-110">
                          <Icons.Reject
                            color="red"
                            onClick={handleReject}
                            className="w-10 h-10"
                          />
                        </span>
                      </Button>
                    </div>
                    <div className="flex justify-center items-center w-10 h-10 overflow-hidden">
                      <Button className="!bg-none !border-none">
                        <span className="hover:scale-110">
                          <Icons.Return
                            color="blue"
                            onClick={handleReturn}
                            className="w-10 h-10"
                          />
                        </span>
                      </Button>
                    </div>
                  </div>
                </td>
              ) : (
                null
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <Pagination
          className="!font-squada flex justify-end"
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onChange={handlePageChange}
          showSizeChanger
          onShowSizeChange={handlePageChange}
          pageSizeOptions={["5", "10", "20", "50"]}
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
