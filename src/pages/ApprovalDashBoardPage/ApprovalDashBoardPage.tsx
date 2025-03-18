import { useEffect, useState } from "react";
import ApprovalChart from "../../components/ApprovalComponents/ApprovalChart";
import ApprovalDashboard from "../../components/ApprovalComponents/ApprovalDashboard";
import ModalAddNewClaim from "../../components/UserComponents/ModalAddNewClaim";
import { ClaimRequest } from "../../types/ClaimRequest";
import { searchApprovalClaims } from "../../services/approvalService";

const ApprovalDashBoardPage = () => {
  const [isOpenModalAddNewClaim, setIsOpenModalAddNewClaim] = useState(false);
  const [claimData, setClaimData] = useState<ClaimRequest[]>([]);
  const fetchClaimData = async () => {
    try {
      const response = await searchApprovalClaims({
        searchCondition: {
          keyword: "",
          claim_status: "",
          claim_start_date: "",
          claim_end_date: "",
          is_delete: false,
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 9999,
        },
      });
      setClaimData(response.data.pageData);
      return response.data.pageData;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchClaimData();
  }, []);

  const handleOpenModalAddNewClaim = () => {
    setIsOpenModalAddNewClaim(true);
  };
  const handleCloseModalAddNewClaim = () => {
    setIsOpenModalAddNewClaim(false);
  };
  return (
    <>
      <div className="w-full flex-col">
        <div className="w-full flex">
          <button
            onClick={handleOpenModalAddNewClaim}
            className="bg-[#FFB17A] text-white px-6 py-2 rounded-full hover:bg-[#FF9147] flex items-center gap-2 text-lg"
          >
            <span>+</span>
            Add New Claim
          </button>
        </div>
        {/* <TableUserDashboard data={data} /> */}
        <ModalAddNewClaim
          isOpen={isOpenModalAddNewClaim}
          onClose={handleCloseModalAddNewClaim}
        />
        <div className="w-full flex-1">
          <div className="flex flex-col justify-center">
            <h1 className="font-bold text-xl my-4">Overall</h1>
            <ApprovalDashboard claimData={claimData} />
          </div>
          <div>
            <h1 className="font-bold text-xl my-4">Chart</h1>
            <ApprovalChart data={claimData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ApprovalDashBoardPage;
