import React from "react";
import { Modal } from "antd";
import { ClaimInfo, ClaimLog } from "../../types/ClaimType";
import Icons from "../icon";
import { getClaimLog } from "../../services/claimService";
import { formatDate } from "../../utils/formatDate";

interface ClaimRequestModalProps {
  visible: boolean;
  onClose: () => void;
  id: ClaimInfo;
}

const ClaimRequestDetail: React.FC<ClaimRequestModalProps> = ({
  visible,
  onClose,
  id,
}) => {
  const [ClaimRequestDetail] = React.useState<ClaimInfo>(id);
  const [claimLogs, setClaimLogs] = React.useState<ClaimLog[]>([]);
  const [loadingLogs, setLoadingLogs] = React.useState(false);

  const fetchClaimLogs = async (claimId: string) => {
    setLoadingLogs(true);
    try {
      const response = await getClaimLog(claimId, {
        pageNum: 1,
        pageSize: 10,
      });
      if (response.success) {
        // Sort logs by created_at in descending order (newest first)
        const sortedLogs = [...response.data.pageData].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setClaimLogs(sortedLogs);
      }
    } catch (error) {
      console.error("Error fetching claim logs:", error);
    } finally {
      setLoadingLogs(false);
    }
  };
  React.useEffect(() => {
    if (ClaimRequestDetail) {
      fetchClaimLogs(ClaimRequestDetail._id);
    }
  }
    , [ClaimRequestDetail]);

  return (
    <Modal
      title={<h4 className="text-2xl font-semibold text-[#FF9447] mb-4 border-b pb-2">
        Claim Request Detail : {ClaimRequestDetail.claim_name}</h4>}
      open={visible}
      cancelButtonProps={{ hidden: true }}
      onOk={onClose}
      onCancel={onClose}
      className="flex items-center justify-center"
      style={{ minWidth: "40%", maxWidth: "80%", fontFamily: "Squada One" }}
      styles={{ content: { backgroundColor: '#FAFAFA' }, footer: { backgroundColor: '#FAFAFA' }, header: { backgroundColor: '#FAFAFA' } }}
    >
      <div className=" font-squada flex-col bg-white p-8 -m-2 my-2 rounded-2xl shadow-md" >
        <div className="flex-col space-y-4">
          <div className="flex items-center">
            <span className="w-1/2 font-medium text-gray-600 text-lg">Create at: </span>
            <span className="w-1/2 text-gray-800 truncate text-lg">{formatDate(ClaimRequestDetail?.created_at)}</span>
          </div>
          <div className="flex items-center">
            <span className="w-1/2 font-medium text-gray-600 text-lg">Claimer Name:</span>
            <span className="w-1/2 text-gray-800 truncate text-lg"> {ClaimRequestDetail?.staff_name}</span>
          </div>
          <div className="flex items-center">
            <span className="w-1/2 font-medium text-gray-600 text-lg">Email:</span>
            <span className="w-1/2 text-gray-800 truncate text-lg"> {ClaimRequestDetail?.staff_email}</span>
          </div>
          <div className="flex items-center">
            {/* icon */}
            <span className="w-1/2 font-medium text-gray-600 text-lg">Approval Name: </span>
            <span className="w-1/2 text-gray-800 truncate text-lg">{ClaimRequestDetail?.approval_info.user_name}</span>
          </div>
          <div className="flex items-center">
            <span className="w-1/2 font-medium text-gray-600 text-lg">Project: </span>
            <span className="w-1/2 text-gray-800 truncate text-lg">
              {ClaimRequestDetail?.project_info.project_name}</span>
          </div>
          <div className="flex items-center pb-2">
            <span className="w-1/2 font-medium text-gray-600 text-lg">Role in Project: </span>
            <span className="w-1/2 text-gray-800 truncate text-lg">
              {ClaimRequestDetail?.role_in_project}</span>
          </div>
          <div className="flex-col mt-4 w-full">
            <h4 className="font-semibold text-xl !text-gradient-color mb-4 border-t pt-4 text-[#FF9447] inline-flex items-center"><Icons.Clock className="w-10 h-10 mr-2" /> Claim Time: </h4>
            <table className="min-w-full divide-y divide-[#FF9447] border border-[#FF9447] w-fit">
              <thead className="bg-gray-50 rounded-t-lg">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Start date</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Total Working Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{formatDate(ClaimRequestDetail?.claim_start_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{formatDate(ClaimRequestDetail?.claim_end_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{ClaimRequestDetail?.total_work_time} hours</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-8">
            <h4 className="text-lg font-bold text-[#FF9447] mb-4 flex items-center">
              <Icons.History className="w-10 h-10 mr-2" />
              Status History
            </h4>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              {loadingLogs ? (
                <div className="text-center py-4">Loading logs...</div>
              ) : claimLogs.length > 0 ? (
                <div className="space-y-4">
                  {claimLogs.map((log) => (
                    <div
                      key={log._id}
                      className="flex items-center justify-between pb-2"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            {new Date(log.created_at).toLocaleDateString()}{" "}
                            {new Date(log.created_at).toLocaleTimeString()}
                          </span>
                          <span className="font-medium">
                            Changed by: {log.updated_by}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded text-sm ${log.old_status === "Approved"
                            ? "bg-green-100 text-green-600"
                            : log.old_status === "Rejected"
                              ? "bg-red-100 text-red-600"
                              : log.old_status === "Pending Approval"
                                ? "bg-yellow-100 text-yellow-600"
                                : log.old_status === "Canceled"
                                  ? "bg-purple-100 text-purple-600"
                                  : log.old_status === "Paid"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                          {log.old_status}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span
                          className={`px-2 py-1 rounded text-sm ${log.new_status === "Approved"
                            ? "bg-green-100 text-green-600"
                            : log.new_status === "Rejected"
                              ? "bg-red-100 text-red-600"
                              : log.new_status === "Pending Approval"
                                ? "bg-yellow-100 text-yellow-600"
                                : log.new_status === "Canceled"
                                  ? "bg-purple-100 text-purple-600"
                                  : log.new_status === "Paid"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                          {log.new_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No status changes found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .ant-modal-content {
          width: 650px !important;
        }
      `}</style>
    </Modal >
  );
};

export default ClaimRequestDetail;
