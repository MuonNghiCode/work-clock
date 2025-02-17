import React from "react";
import { ClaimRequest, generateFakeData } from "../../model/ClaimRequest";
import TableApproval from "./TableApproval";
const ApprovalPage: React.FC = () => {
  const data: ClaimRequest[] = generateFakeData();
  return (
    <>
      <div className="w-full flex justify-end">
        <div className="w-3/4 flex-col">
          <h1 className="text-5xl !py-9">Approvals Management</h1>
          <TableApproval data={data} />
        </div>
      </div>
    </>
  );
};

export default ApprovalPage;
