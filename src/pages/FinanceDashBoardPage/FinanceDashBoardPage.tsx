import React, { useState } from "react";
import { data } from "../FinancePage/FinancePage"; // Adjust the import path as necessary
import FinanceDashboard from "../../components/FinanceComponents/FinanceDashboard";
import { Button } from "antd";
import ModalAddNewClaim from "../../components/UserComponents/ModalAddNewClaim";

const FinanceDashboardPage: React.FC = () => {
  const [isOpenModalAddNewClaim, setIsOpenModalAddNewClaim] = useState(false);

  const handleOpenModalAddNewClaim = () => {
    setIsOpenModalAddNewClaim(true);
  };
  const handleCloseModalAddNewClaim = () => {
    setIsOpenModalAddNewClaim(false);
  };
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Finance Dashboard</h1>
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
      <div className="lg:w-10/12 w-full mx-auto">
        <FinanceDashboard data={data} />
      </div>
    </>
  );
};

export default FinanceDashboardPage;
