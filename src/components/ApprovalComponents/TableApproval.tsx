import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Pagination } from "antd";
import { useLocation } from 'react-router-dom';
import ClaimRequestDetail from "./ClaimRequestDetail";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import Icons from "../icon";
import { searchApprovalClaims } from "../../services/approvalService";
import { toast } from "react-toastify";
import debounce from "lodash/debounce";
import { ClaimInfo } from "../../types/ClaimType";
import { formatDate } from "../../utils/formatDate";

const TableApproval: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialStatusFilter = queryParams.get('status') || 'Pending Approval';

  const [approvalData, setApprovalData] = useState<ClaimInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [statusFilter] = useState<string>(initialStatusFilter);
  const [showApprovalDetail, setShowApprovalDetail] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [totalItems, setTotalItems] = useState<number>(0);
  const [selectedApproval, setSelectedApproval] = useState<ClaimInfo | null>(null);
  const [claimId, setClaimId] = useState<string>("");

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
  }, [statusFilter]);

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

  // const handleStatusChange = (status: string) => {
  //   setStatusFilter(status);
  //   setCurrentPage(1);
  //   fetchApprovalData();
  // };

  // const statusTags = ["Pending Approval", "Approved", "Rejected"];
  // const statusTags = ["Pending Approval"];

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 1000),
    []
  );

  const handleShowApprovalDetail = (claim: ClaimInfo) => {
    setSelectedApproval(claim);
    setShowApprovalDetail(true);
  };

  const handleApprove = (id: string) => {
    setClaimId(id);
    setMessage("Approved");
    setShowConfirmModal(true);
  };

  const handleReject = (id: string) => {
    setClaimId(id);
    setMessage("Rejected");
    setShowConfirmModal(true);
  };

  const handleClose = () => {
    setShowApprovalDetail(false);
    setShowConfirmModal(false);
  };

  const handleConfirm = () => {
    fetchApprovalData();
    setShowConfirmModal(false);
  }

  const handleReturnClaim = (id: string) => {
    setClaimId(id);
    setMessage("Return");
    setShowConfirmModal(true);
  }

  const handleStatusChangeHTML = (status: string) => {
    switch (status) {
      case "Pending Approval":
        return <span className="text-gray-300">Pending Approval</span>;
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
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div className="flex items-center ">
          {/* <select
            onChange={(value) => handleStatusChange(value.target.value)}
            className="px-3 py-1 border rounded-lg font-squada text-lg"
            value={statusFilter}
          >
            {statusTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select> */}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search by claim name..."
            className="w-[300px] px-4 py-2 border rounded-full pr-10"
            defaultValue={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Icons.SearchIcon
            className="absolute right-3 top-2.5 text-gray-400"
            fontSize={20}
          />
        </div>
      </div >
      <div className="overflow-x-auto max-w-screen">
        <table className="min-w-full !border-separate border-spacing-y-2.5 text-black border-0 p-2">
          <thead className="bg-brand-grandient h-[70px] text-lg text-white !rounded-t-lg">
            <tr className="bg-gradient from-[FEB78A] to-[FF914D] w-full">
              <th className="border-white px-4 py-2 !rounded-tl-2xl">Claim Name</th>
              <th className="border-l-2 border-white px-4 py-2">Claimer</th>
              <th className="border-l-2 border-white px-4 py-2">Total Work Time</th>
              <th className="border-l-2 border-white px-4 py-2">Status</th>
              {statusFilter === "Pending Approval" ? (
                <>
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
                onClick={() => handleShowApprovalDetail(item)}
                key={item._id}
                className="h-[70px] bg-white overflow-hidden text-center border-collapse hover:shadow-brand-orange !rounded-2xl"
              >
                <td className="px-4 py-2 rounded-l-2xl">{item.claim_name}</td>
                <td className="px-4 py-2">{item.staff_name}</td>
                <td className="px-4 py-2 text-gradient-color">{item.total_work_time} hours</td>
                <td className="px-4 py-2">{handleStatusChangeHTML(item.claim_status)}</td>
                {item.claim_status !== "Pending Approval" ? (
                  <td className="px-4 py-2 rounded-r-2xl ">{formatDate(item.created_at)}</td>
                ) : (
                  <>
                    <td className="px-4 py-2">{formatDate(item.created_at)}</td>
                    <td
                      className="action px-4 py-2 rounded-r-2xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="w-full flex justify-center gap-2 items-center space-x-2">
                        <div className="flex justify-center items-center w-10 h-10 ">
                          <Button className="!bg-transparent !border-none !p-2">
                            <span className="hover:scale-105">
                              <Icons.CircleCheck
                                color="green"
                                onClick={() => handleApprove(item._id)}
                                className="w-10 h-10"
                              />
                            </span>
                          </Button>
                        </div>
                        <div className="flex justify-center items-center w-10 h-10 ">
                          <Button className="!bg-transparent !border-none !p-2">
                            <span className="hover:scale-105">
                              <Icons.CircleReject
                                color="red"
                                onClick={() => handleReject(item._id)}
                                className="w-10 h-10"
                              />
                            </span>
                          </Button>
                        </div>
                        <div className="flex justify-center items-center w-10 h-10 ">
                          <Button className="!bg-transparent !border-none !p-2">
                            <span className="hover:scale-105">
                              <Icons.Return
                                color="blue"
                                onClick={() => handleReturnClaim(item._id)}
                                className="w-10 h-10"
                              />
                            </span>
                          </Button>
                        </div>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4 w-full">
        <Pagination
          className="!font-squada flex justify-end"
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onChange={handlePageChange}
          showSizeChanger={false}
          onShowSizeChange={handlePageChange}
          pageSizeOptions={["5", "10", "20", "50"]}
        />
      </div>
      {
        selectedApproval && (
          <ClaimRequestDetail
            visible={showApprovalDetail}
            onClose={handleClose}
            id={selectedApproval} // Pass the selectedApprovalId here
          />
        )
      }
      <ConfirmModal
        modalProps={{
          visible: showConfirmModal,
          onClose: handleClose,
          onConfirm: handleConfirm
        }}
        messageProps={{
          message: message,
          id: claimId
        }}
      />
    </>
  );
};

export default TableApproval;
