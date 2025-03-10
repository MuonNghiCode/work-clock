import React from "react";
import TableApproval from "../../components/ApprovalComponents/TableApproval";
const ApprovalPage: React.FC = () => {
  return (
    <>
      <div className="w-full flex-col ">
        <header>
          <h1 className="text-5xl !py-9">Approvals Management</h1>
        </header>
        <TableApproval />
      </div>
    </>
  );
};

export default ApprovalPage;
