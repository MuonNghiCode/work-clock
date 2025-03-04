import { useState } from "react";
// import { ClaimRequest } from '../../types/ClaimRequest'
// import { generateFakeData } from '../../types/ClaimRequest'
import { Button } from "antd";
import ModalAddNewClaim from "../../components/UserComponents/ModalAddNewClaim";

const UserDashboardPage = () => {
  // const data: ClaimRequest[] = generateFakeData();
  const [isOpenModalAddNewClaim, setIsOpenModalAddNewClaim] = useState(false);

  const handleOpenModalAddNewClaim = () => {
    setIsOpenModalAddNewClaim(true);
  };
  const handleCloseModalAddNewClaim = () => {
    setIsOpenModalAddNewClaim(false);
  };

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <h1 className="text-3xl">User Dashboard</h1>
        <Button
          className="w-42 !h-12 !p-4 !bg-[#ff914d] !text-lg !font-semibold !text-white hover:!bg-[#feb78a]"
          onClick={handleOpenModalAddNewClaim}
        >
          Add New Claim
        </Button>
      </div>
      <div className="flex justify-between w-full mt-4">
        <div className="text-2xl border w-1/4 mr-5 pl-4 pt-5 flex flex-col items-start rounded-[10px] text-center h-25 cursor-pointer transition duration-300 bg-gradient-to-b from-white to-transparent hover:from-white hover:to-[#feb78a] active:to-[#feb78a]">
          <div className="text-4xl font-bold">0</div>
          <div>Created Claims</div>
        </div>
        {/*-----------------------------------*/}
        <div className="text-2xl border w-1/4 mr-5 pl-4 pt-5 flex flex-col items-start rounded-[10px] text-center h-25 cursor-pointer transition duration-300 bg-gradient-to-b from-white to-transparent hover:from-white hover:to-[#feb78a] active:to-[#feb78a]">
          <div className="text-4xl font-bold">0</div>
          <div>Draft Claims</div>
        </div>
        {/*-----------------------------------*/}
        <div className="text-2xl border w-1/4 mr-5 pl-4 pt-5 flex flex-col items-start rounded-[10px] text-center h-25 cursor-pointer transition duration-300 bg-gradient-to-b from-white to-transparent hover:from-white hover:to-[#feb78a] active:to-[#feb78a]">
          <div className="text-4xl font-bold">0</div>
          <div>Pending Claims</div>
        </div>
        {/*-----------------------------------*/}
        <div className="text-2xl border w-1/4 pl-4 pt-5 flex flex-col items-start rounded-[10px] text-center h-25 cursor-pointer transition duration-300 bg-gradient-to-b from-white to-transparent hover:from-white hover:to-[#feb78a] active:to-[#feb78a]">
          <div className="text-4xl font-bold">0</div>
          <div>Success Claims</div>
        </div>
      </div>

      {/* <TableUserDashboard data={data} /> */}
      <ModalAddNewClaim
        isOpen={isOpenModalAddNewClaim}
        onClose={handleCloseModalAddNewClaim}
      />
    </>
  );
};

export default UserDashboardPage;
