import React, { useState, useEffect, useCallback } from "react";
import { Form } from "antd";
import EditRequestModal from "../../components/RequestComponents/EditRequestModal/EditRequestModal";
import RequestApprovalModal from "../../components/RequestComponents/RequestApprovalModal/RequestApprovalModal";
import CancelRequestModal from "../../components/RequestComponents/CancelRequestModal/CancelRequestModal";
import TableRequest from "../../components/RequestComponents/TableRequest/TableRequest";
import {
  getClaimerSearch,
  updateClaimStatus,
} from "../../services/claimService";
import {
  ClaimItem,
  SearchCondition,
  PageInfoRequest,
} from "../../types/ClaimType";
import { ResponseModel } from "../../models/ResponseModel";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { Search } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";

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
  approval_name: string;
}

const RequestPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ClaimRequest | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<ClaimRequest | null>(
    null
  );
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvingRecord, setApprovingRecord] = useState<ClaimRequest | null>(
    null
  );
  const [form] = Form.useForm();
  const [apiData, setApiData] = useState<ClaimRequest[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  const mapClaimToRequest = (item: ClaimItem): ClaimRequest => ({
    key: item._id,
    claimname: item.claim_name || "Unnamed Claim",
    project: item.project_info?.project_name || "Unknown",
    start_date: new Date(item.claim_start_date).toLocaleDateString("vi-VN"),
    end_date: new Date(item.claim_end_date).toLocaleDateString("vi-VN"),
    timeFrom: new Date(item.claim_start_date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    timeTo: new Date(item.claim_end_date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    totalHours: item.total_work_time?.toString() || "0",
    status: item.claim_status || "Unknown",
    approval_name: item.approval_info?.user_name || "Not assigned"
  });

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const searchCondition: SearchCondition = {
        keyword: searchText,
        claim_status: statusFilter === "all" ? "" : statusFilter,
        claim_start_date: "",
        claim_end_date: "",
        is_delete: false,
      };
      const pageInfo: PageInfoRequest = { pageNum: currentPage, pageSize };

      const response: ResponseModel<{
        pageData: ClaimItem[];
        pageInfo: PageInfoRequest;
      }> = await getClaimerSearch(searchCondition, pageInfo);
      if (response.success) {
        const claims = response.data.pageData.map(mapClaimToRequest);
        claims.sort((a, b) => {
          const claimA = response.data.pageData.find(claim => claim._id === a.key);
          const claimB = response.data.pageData.find(claim => claim._id === b.key);
          return new Date(claimB?.created_at || 0).getTime() - new Date(claimA?.created_at || 0).getTime();
        });
        setApiData(claims);
        setTotalItems(response.data.pageInfo.totalItems || 0);
      } else {
        console.warn("API returned no data for this search:", searchCondition);
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
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
      if (!editingRecord) throw new Error("No record being edited");
      setIsEditModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Error in handleEditModalOk:", error);
    }
  };

  const handleDelete = (record: ClaimRequest) => {
    setDeletingRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalOk = () => {
    if (deletingRecord) {
      setApiData((prev) =>
        prev.filter((item) => item.key !== deletingRecord.key)
      );
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

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleRequestApproval = (record: ClaimRequest) => {
    setApprovingRecord(record);
    setIsApprovalModalOpen(true);
  };

  const handleApprovalConfirm = async (comment: string) => {
    if (!approvingRecord) return;
    setLoading(true);
    try {
      const payload = {
        _id: approvingRecord.key,
        claim_status: "Pending Approval",
        comment: comment || "",
      };
      const response = await updateClaimStatus(payload);
      if (response.success) {
        toast.success("Request approval sent successfully");
        fetchClaims();
      } else {
        throw new Error(response.message || "Failed to update status");
      }
    } catch (error: any) {
      console.error("Failed to send request approval:", error);
      toast.error(error.message || "Failed to send request approval");
    } finally {
      setLoading(false);
      setIsApprovalModalOpen(false);
      setApprovingRecord(null);
    }
  };

  const handleApprovalCancel = () => {
    setIsApprovalModalOpen(false);
    setApprovingRecord(null);
  };

  const handleCancelRequest = async (record: ClaimRequest) => {
    setLoading(true);
    try {
      const payload = {
        _id: record.key,
        claim_status: "Canceled",
        comment: "",
      };
      const response = await updateClaimStatus(payload);
      if (response.success) {
        toast.success("Claim canceled successfully");
        fetchClaims();
      } else {
        throw new Error(response.message || "Failed to cancel claim");
      }
    } catch (error: any) {
      console.error("Failed to cancel claim:", error);
      toast.error(error.message || "Failed to cancel claim");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="p-6 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex justify-between items-center mb-4"
        data-aos="fade-down"
        data-aos-duration="1000"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, x: -50 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        <div>
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="px-3 py-1 border rounded-lg font-squada text-lg"
          >
            <option value="all">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Canceled">Canceled</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        <div className="relative w-[300px]">
          <input
            type="text"
            placeholder="Search claim name"
            className="w-full px-4 py-2 border rounded-full pr-10 font-squada"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Search
            className="absolute right-3 top-2.5 text-gray-400"
            size={20}
          />
        </div>
      </motion.div>
      <motion.div
        data-aos="fade-up"
        data-aos-duration="1000"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <TableRequest
          apiData={apiData}
          totalItems={totalItems}
          loading={loading}
          pagination={
            apiData.length > 0
              ? { currentPage, pageSize, onPageChange: handlePageChange }
              : undefined
          }
          actions={{
            onEdit: handleEdit,
            onDelete: handleDelete,
            onRequestApproval: handleRequestApproval,
            onCancel: handleCancelRequest,
          }}
        />
      </motion.div>
      <EditRequestModal
        isOpen={isEditModalOpen}
        onCancel={handleEditModalCancel}
        onOk={handleEditModalOk}
        editingRecord={editingRecord}
        claimId={editingRecord?.key || ""}
        refreshData={fetchClaims}
      />
      <CancelRequestModal
        isOpen={isDeleteModalOpen}
        onOk={handleDeleteModalOk}
        onCancel={handleDeleteModalCancel}
        cancelingRecord={deletingRecord}
      />
      <RequestApprovalModal
        isOpen={isApprovalModalOpen}
        onCancel={handleApprovalCancel}
        onConfirm={handleApprovalConfirm}
        approvingRecord={approvingRecord}
        loading={loading}
      />
    </motion.div>
  );
};

export default RequestPage;
