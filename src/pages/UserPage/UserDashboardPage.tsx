import { useState } from "react";
import { Button } from "antd";
import ModalAddNewClaim from "../../components/UserComponents/ModalAddNewClaim";
import { motion } from "framer-motion";

const fadeInScaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

interface StatCardProps {
  label: string;
  value: number;
}

const StatCard = ({ label, value }: StatCardProps) => (
  <motion.div
    variants={fadeInScaleUp}
    initial="hidden"
    animate="visible"
    className="p-8 rounded-2xl flex flex-col items-center justify-center bg-white bg-opacity-50 shadow-lg w-full text-center hover:scale-105 transition duration-300"
  >
    <p className="text-xl font-medium text-gray-700">{label}</p>
    <p className="text-4xl font-bold text-blue-600">{value}</p>
  </motion.div>
);

const UserDashboardPage = () => {
  const [isOpenModalAddNewClaim, setIsOpenModalAddNewClaim] = useState(false);

  const handleOpenModalAddNewClaim = () => setIsOpenModalAddNewClaim(true);
  const handleCloseModalAddNewClaim = () => setIsOpenModalAddNewClaim(false);

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <h1 className="text-[40px] mt-4 font-bold">User Dashboard</h1>
        <Button
          className="w-50 !h-12 !p-4 !bg-[#ff914d] !text-lg !font-semibold !text-white hover:!bg-[#feb78a]"
          onClick={handleOpenModalAddNewClaim}
        >
          Add New Claim
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-4">
        <StatCard label="Created Claims" value={0} />
        <StatCard label="Draft Claims" value={0} />
        <StatCard label="Pending Claims" value={0} />
        <StatCard label="Success Claims" value={0} />
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

      <ModalAddNewClaim
        isOpen={isOpenModalAddNewClaim}
        onClose={handleCloseModalAddNewClaim}
      />
    </>
  );
};

export default UserDashboardPage;
