// import TableUserDashboard from "../../components/UserDashboardTable/TableUserDashboard";
// import { ClaimRequest, generateFakeData } from "../../types/ClaimRequest";
import { useState } from "react";
import { Button } from "antd";
import ModalAddNewClaim from "../../components/UserComponents/ModalAddNewClaim";
function UserDashboard() {
  // const data: ClaimRequest[] = generateFakeData();
  const [isOpenModalAddNewClaim, setIsOpenModalAddNewClaim] = useState(false);

  const handleOpenModalAddNewClaim = () => {
    setIsOpenModalAddNewClaim(true);
  };
  const handleCloseModalAddNewClaim = () => {
    setIsOpenModalAddNewClaim(false);
  };
  return (
    <div>
      <div className="w-full flex justify-center">
        <div className="flex flex-col w-11/12">
          <h1 className="text-5xl !py-9">Dashboard</h1>
          <div className="w-full flex">
            <Button
              className="w-42 !h-12 !p-4 !bg-[#ff914d] !text-lg !font-semibold !text-white hover:!bg-[#feb78a]"
              onClick={handleOpenModalAddNewClaim}
            >
              Add New Claim
            </Button>
          </div>
          {/* <TableUserDashboard data={data} /> */}
          <ModalAddNewClaim
            isOpen={isOpenModalAddNewClaim}
            onClose={handleCloseModalAddNewClaim}
          />
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
