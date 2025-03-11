import React from "react";
import { Modal } from "antd";
import { ClaimInfo } from "../../types/ClaimType";

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
            <span className="w-1/2 text-gray-800 truncate text-lg">{ClaimRequestDetail?.created_at}</span>
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
            <h4 className="font-semibold text-xl !text-gradient-color mb-4 border-t pt-4 text-[#FF9447] ">Claim Time: </h4>
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
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{ClaimRequestDetail?.claim_start_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{ClaimRequestDetail?.claim_end_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{ClaimRequestDetail?.total_work_time} hours</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal >
  );
};

export default ClaimRequestDetail;
