import React, { useState } from "react";
import FinanceDashboard from "../../components/FinanceComponents/FinanceDashboard";
import ModalAddNewClaim from "../../components/UserComponents/ModalAddNewClaim";

const FinanceDashboardPage: React.FC = () => {
  const [isOpenModalAddNewClaim, setIsOpenModalAddNewClaim] = useState(false);
  const handleOpenModalAddNewClaim = () => setIsOpenModalAddNewClaim(true);
  const handleCloseModalAddNewClaim = () => setIsOpenModalAddNewClaim(false);

  return (
    <>
      <div className="mx-auto p-1">
        <div className="flex items-center justify-end w-full mb-10">
          <button
            className="bg-[#FFB17A] text-white px-6 py-2 rounded-full hover:bg-[#FF9147] flex items-center gap-2 text-sm"
            onClick={handleOpenModalAddNewClaim}
          >
            <span>+</span>
            Add New Claim
          </button>
        </div>
        <div className="w-full mx-auto">
          <FinanceDashboard />
        </div>
      </div>
      <ModalAddNewClaim
        isOpen={isOpenModalAddNewClaim}
        onClose={handleCloseModalAddNewClaim}
      />
    </>
  );
};

export default FinanceDashboardPage;
