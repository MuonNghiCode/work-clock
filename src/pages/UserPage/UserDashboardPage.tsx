import { useState } from "react";
import { Button } from "antd";
import ModalAddNewClaim from "../../components/UserComponents/ModalAddNewClaim";
import { motion } from "framer-motion";
import Icons from "../../components/icon";

const fadeInScaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
}

const StatCard = ({
  icon,
  label,
  value,
  bgColor,
  textColor,
}: StatCardProps) => (
  <motion.div
    variants={fadeInScaleUp}
    initial="hidden"
    animate="visible"
    className={` rounded-2xl flex flex-col items-center justify-center ${bgColor} bg-opacity-50 shadow-lg w-full text-center hover:scale-105 transition duration-300`}
  >
    {icon && (
      <div className="p-3 rounded-full bg-white bg-opacity-30">{icon}</div>
    )}
    <p className={`text-xl font-medium ${textColor}`}>{label}</p>
    <p className={`text-4xl font-bold ${textColor}`}>{value}</p>
  </motion.div>
);

const UserDashboardPage = () => {
  const [isOpenModalAddNewClaim, setIsOpenModalAddNewClaim] = useState(false);

  const handleOpenModalAddNewClaim = () => setIsOpenModalAddNewClaim(true);
  const handleCloseModalAddNewClaim = () => setIsOpenModalAddNewClaim(false);

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <Button
          className="w-50 !h-12 !p-4 !bg-[#ff914d] !text-lg !font-semibold !text-white hover:!bg-[#feb78a]"
          onClick={handleOpenModalAddNewClaim}
        >
          Add New Claim
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Icons.FormIcon className="text-3xl text-blue-600" />}
          label="Created Claims"
          value={0}
          bgColor="bg-gradient-to-b from-blue-300 to-blue-100 p-6 rounded-xl shadow-lg relative hover:shadow-xl hover:bg-blue-400"
          textColor="text-black-900 font-bold"
        />
        <StatCard
          icon={<Icons.Email className="text-3xl   text-orange-500" />}
          label="Draft Claims"
          value={0}
          bgColor="bg-gradient-to-b from-orange-300 to-orange-100"
          textColor="text-black-900 font-bold"
        />
        <StatCard
          icon={<Icons.Pending className="text-3xl text-yellow-500" />}
          label="Pending Claims"
          value={0}
          bgColor="bg-gradient-to-b from-yellow-300 to-yellow-100"
          textColor="text-black-900 font-bold"
        />
        <StatCard
          icon={<Icons.CircleCheck className="text-3xl  text-green-600" />}
          label="Success Claims"
          value={0}
          bgColor="bg-gradient-to-b from-green-300 to-green-100"
          textColor="text-black-900 font-bold"
        />
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
