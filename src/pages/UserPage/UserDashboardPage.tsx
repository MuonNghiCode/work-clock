import { useEffect, useState, useCallback } from "react";
import { Button, Tag, Form } from "antd";
import ModalAddNewClaim from "../../components/UserComponents/ModalAddNewClaim";
import EditRequestModal from "../../components/RequestComponents/EditRequestModal/EditRequestModal";
import RequestApprovalModal from "../../components/RequestComponents/RequestApprovalModal/RequestApprovalModal";
import CancelRequestModal from "../../components/RequestComponents/CancelRequestModal/CancelRequestModal";
import TableRequest from "../../components/RequestComponents/TableRequest/TableRequest";
import { getAllClaims, updateClaimStatus } from "../../services/claimService";
import { ClaimItem } from "../../types/ClaimType";

import { debounce } from "lodash";
import { CheckOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { Search } from "lucide-react";

import "aos/dist/aos.css";
import Icons from "../../components/icon";
import { motion } from "framer-motion";

const fadeInScaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

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

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
}

const StatCard = ({
  icon,
  label,
  value,
  bgColor,
  textColor,
}: StatCardProps) => (
  <motion.div
    variants={fadeInScaleUp}
    initial="hidden"
    animate="visible"
    className={` rounded-2xl flex flex-col items-center justify-center ${bgColor} bg-opacity-50 shadow-lg w-full text-center hover:scale-105 transition duration-300`}
  >
    {icon && (
      <div className="p-3 rounded-full bg-white bg-opacity-30">{icon}</div>
    )}
    <p className={`text-xl font-medium ${textColor}`}>{label}</p>
    <p className={`text-4xl font-bold ${textColor}`}>{value}</p>
  </motion.div>
);

const UserDashboardPage = () => {
  const [isOpenModalAddNewClaim, setIsOpenModalAddNewClaim] = useState(false);
  const [ClaimsCount, setClaimsCount] = useState(0);
  const [draftClaimsCount, setDraftClaimsCount] = useState(0);
  const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
  const [successClaimsCount, setSuccessClaimsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
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

  const handleOpenModalAddNewClaim = () => setIsOpenModalAddNewClaim(true);
  const handleCloseModalAddNewClaim = () => setIsOpenModalAddNewClaim(false);

  const mapClaimToRequest = (item: Partial<ClaimItem>): ClaimRequest => ({
    key: item._id || "unknown",
    claimname: item.claim_name || "Unnamed Claim",
    project: item.project_info?.project_name || "Unknown",
    start_date: item.claim_start_date
      ? new Date(item.claim_start_date).toLocaleDateString("vi-VN")
      : "N/A",
    end_date: item.claim_end_date
      ? new Date(item.claim_end_date).toLocaleDateString("vi-VN")
      : "N/A",
    timeFrom: item.claim_start_date
      ? new Date(item.claim_start_date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "N/A",
    timeTo: item.claim_end_date
      ? new Date(item.claim_end_date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "N/A",
    totalHours: item.total_work_time?.toString() || "0",
    status: item.claim_status || "Unknown",
  });

  const fetchClaims = async (pageNum: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await getAllClaims({
        searchCondition: {
          keyword: searchText,
          claim_status:
            statusFilter === "All" || !statusFilter ? "" : statusFilter,
          is_delete: false,
          project_start_date: "",
          project_end_date: "",
        },
        pageInfo: {
          pageNum,
          pageSize,
          totalItems: 0,
          totalPages: 0,
        },
      });

      const claims = response.data.pageData.map(mapClaimToRequest);
      setApiData(claims);
      setClaimsCount(response.data.pageInfo.totalItems || 0);
      setTotalItems(response.data.pageInfo.totalItems || 0); // Đảm bảo totalItems cập nhật đúng
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDraftClaims = async () => {
    try {
      const response = await getAllClaims({
        searchCondition: {
          keyword: "",
          claim_status: "Draft",
          project_start_date: "",
          project_end_date: "",
          is_delete: false,
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 30,
          totalItems: 0,
          totalPages: 0,
        },
      });
      setDraftClaimsCount(response.data.pageData.length);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSuccessClaims = async () => {
    try {
      const response = await getAllClaims({
        searchCondition: {
          keyword: "",
          claim_status: "Paid",
          project_start_date: "",
          project_end_date: "",
          is_delete: false,
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 30,
          totalItems: 0,
          totalPages: 0,
        },
      });
      setSuccessClaimsCount(response.data.pageData.length);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPendingClaims = async () => {
    try {
      const response = await getAllClaims({
        searchCondition: {
          keyword: "",
          claim_status: "Pending Approval",
          project_start_date: "",
          project_end_date: "",
          is_delete: false,
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
        },
      });
      setPendingClaimsCount(response.data.pageData.length);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClaims(currentPage, pageSize);
    fetchDraftClaims();
    fetchPendingClaims();
    fetchSuccessClaims();
  }, [currentPage, pageSize, statusFilter, searchText]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

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

  const handleStatusChange = (status: string) => {
    setStatusFilter(status === "All" ? null : status);
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
        fetchClaims(currentPage, pageSize);
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
        fetchClaims(currentPage, pageSize);
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

  const handleSearch = useCallback(
    debounce((value: string) => {
      setCurrentPage(1);
      setSearchText(value);
    }, 1000),
    []
  );

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <h1 className="text-[40px] mt-4 font-bold">User Dashboard</h1>
        <Button
          className="w-50 !h-12 !p-4 !bg-[#ff914d] !text-lg !font-semibold !text-white hover:!bg-[#feb78a]"
          onClick={handleOpenModalAddNewClaim}
        >
          Add New Claim
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Icons.FormIcon className="text-3xl text-blue-600" />}
          label="Created Claims"
          value={ClaimsCount}
          bgColor="bg-gradient-to-b from-blue-300 to-blue-100 p-6 rounded-xl shadow-lg relative hover:shadow-xl hover:bg-blue-400"
          textColor="text-black-900 font-bold"
        />
        <StatCard
          icon={<Icons.Email className="text-3xl text-orange-500" />}
          label="Draft Claims"
          value={draftClaimsCount}
          bgColor="bg-gradient-to-b from-orange-300 to-orange-100"
          textColor="text-black-900 font-bold"
        />
        <StatCard
          icon={<Icons.Pending className="text-3xl text-yellow-500" />}
          label="Pending Claims"
          value={pendingClaimsCount}
          bgColor="bg-gradient-to-b from-yellow-300 to-yellow-100"
          textColor="text-black-900 font-bold"
        />
        <StatCard
          icon={<Icons.CircleCheck className="text-3xl text-green-600" />}
          label="Success Claims"
          value={successClaimsCount}
          bgColor="bg-gradient-to-b from-green-300 to-green-100"
          textColor="text-black-900 font-bold"
        />
      </div>

      <div className="col-span-4 p-4 rounded-lg">
        <h3 className="text-lg font-bold">History Transaction</h3>
        <div className="flex justify-between items-center mb-4">
          <div>
            {[
              "All",
              "Draft",
              "Pending Approval",
              "Approved",
              "Rejected",
              "Canceled",
              "Paid",
            ].map((status) => (
              <Tag
                key={status}
                color={
                  statusFilter === status || (status === "All" && !statusFilter)
                    ? "#ff914d"
                    : "default"
                }
                onClick={() => handleStatusChange(status)}
                className="cursor-pointer !px-2 !py-1 !font-squada !text-lg !rounded-lg"
              >
                {(statusFilter === status ||
                  (status === "All" && !statusFilter)) && (
                  <CheckOutlined />
                )}{" "}
                {status}
              </Tag>
            ))}
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
        </div>

        <TableRequest
          apiData={apiData}
          totalItems={totalItems}
          loading={loading}
          pagination={{
            currentPage,
            pageSize,
            onPageChange: handlePageChange,
          }}
          actions={{
            onEdit: handleEdit,
            onDelete: handleDelete,
            onRequestApproval: handleRequestApproval,
            onCancel: handleCancelRequest,
          }}
        />
      </div>

      <ModalAddNewClaim
        isOpen={isOpenModalAddNewClaim}
        onClose={handleCloseModalAddNewClaim}
      />
      <EditRequestModal
        isOpen={isEditModalOpen}
        onCancel={handleEditModalCancel}
        onOk={handleEditModalOk}
        editingRecord={editingRecord}
        claimId={editingRecord?.key || ""}
        refreshData={() => fetchClaims(currentPage, pageSize)}
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
    </>
  );
};

export default UserDashboardPage;
