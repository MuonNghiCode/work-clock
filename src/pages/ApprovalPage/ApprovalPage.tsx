import React from "react";
import TableApproval from "../../components/ApprovalComponents/TableApproval";
const ApprovalPage: React.FC = () => {
  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-full lg:w-3/4 flex-col ">
          <h1 className="text-5xl !py-9">Approvals Management</h1>
          <TableApproval />
        </div>
      </div>
    </>
  );
};

export default ApprovalPage;
