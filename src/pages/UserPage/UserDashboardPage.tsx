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
        <h1 className="text-[40px] mt-4 font-bold">User Dashboard</h1>
        <Button
          className="w-50 !h-12 !p-4 !bg-[#ff914d] !text-lg !font-semibold !text-white hover:!bg-[#feb78a] z-[-10]"
          onClick={handleOpenModalAddNewClaim}
        >
          Add New Claim
        </Button>
      </div>
      <div className="flex justify-between w-full mt-4">
        <div className="bg-white p-4 rounded-lg shadow w-1/4 mr-5">
          <div className="text-3xl text-blue-600 font-bold">0</div>
          <div className="text-lg font-bold">Created Claims</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow w-1/4 mr-5">
          <div className="text-3xl text-blue-600 font-bold">0</div>
          <div className="text-lg font-bold">Draft Claims</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow w-1/4 mr-5">
          <div className="text-3xl text-blue-600 font-bold">0</div>
          <div className="text-lg font-bold">Pending Claims</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow w-1/4">
          <div className="text-3xl text-blue-600 font-bold">0</div>
          <div className="text-lg font-bold">Success Claims</div>
        </div>
      </div>
      <div className="col-span-4 p-4 rounded-lg">
        <h3 className="text-lg font-bold">History Transaction</h3>
        <table className="min-w-full border-separate border-spacing-y-2.5 border-0 text-black w-full">
          <thead className="bg-brand-gradient h-[70px] text-lg text-white !rounded-t-lg">
            <tr className="bg-[linear-gradient(45deg,#FEB78A,#FF914D)]">
              <th className="border-white px-4 py-2 !rounded-tl-2xl">
                Claims ID
              </th>
              <th className="border-l-2 border-white px-4 py-2">Claimer</th>
              <th className="border-l-2 border-white px-4 py-2">Salary</th>
              <th className="border-l-2 border-white px-4 py-2">Status</th>
              <th className="border-l-2 border-white px-4 py-2 !rounded-tr-2xl">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="w-full"></tbody>
        </table>
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
