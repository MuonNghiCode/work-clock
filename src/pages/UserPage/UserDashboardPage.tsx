import { useEffect, useState } from "react";
import { Button } from "antd";
import ModalAddNewClaim from "../../components/UserComponents/ModalAddNewClaim";
import { motion } from "framer-motion";
import Icons from "../../components/icon";
import { getAllClaims } from "../../services/claimService";
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon } from "lucide-react";

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

interface ClaimRequest {
  key: string;
  claimname: string;
  project: string;
  start_date: string;
  end_date: string;
  total_work_time: string;
  timeFrom: string;
  timeTo: string;
  status: string;
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
    className={`rounded-2xl flex flex-col items-center justify-center ${bgColor} bg-opacity-50 shadow-lg w-full text-center hover:scale-105 transition duration-300`}
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
  const [claimsData, setClaimsData] = useState<ClaimRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [ClaimsCount, setClaimsCount] = useState(0);
  const [draftClaimsCount, setDraftClaimsCount] = useState(0);
  const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
  const [successClaimsCount, setSuccessClaimsCount] = useState(0);
  const navigate = useNavigate();

  const handleOpenModalAddNewClaim = () => setIsOpenModalAddNewClaim(true);
  const handleCloseModalAddNewClaim = () => setIsOpenModalAddNewClaim(false);

  const fetchClaims = async () => {
    try {
      const response = await getAllClaims({
        searchCondition: {
          keyword: "",
          claim_status: "",
          is_delete: false,
          project_start_date: "",
          project_end_date: "",
        },
        pageInfo: { pageNum: 1, pageSize: 30 },
      });
      const data = response.data.pageData.map((item: any) => ({
        key: item._id,
        claimname: item.claim_name,
        project: item.project_info?.project_name,
        start_date: new Date(item.claim_start_date).toLocaleDateString("en-US"),
        end_date: new Date(item.claim_end_date).toLocaleDateString("en-US"),
        total_work_time: item.total_work_time,
        timeFrom: new Date(item.claim_start_date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        timeTo: new Date(item.claim_end_date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        status: item.claim_status,
      }));
      setClaimsData(data);
      setClaimsCount(data.length);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDraftClaims = async () => {
    try {
      const response = await getAllClaims({
        searchCondition: {
          claim_status: "Draft",
          is_delete: false,
          keyword: "",
          project_start_date: "",
          project_end_date: "",
        },
        pageInfo: { pageNum: 1, pageSize: 30 },
      });
      setDraftClaimsCount(response.data.pageData.length);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSuccessClaims = async () => {
    try {
      const response = await getAllClaims({
        searchCondition: {
          claim_status: "Paid",
          is_delete: false,
          keyword: "",
          project_start_date: "",
          project_end_date: "",
        },
        pageInfo: { pageNum: 1, pageSize: 30 },
      });
      setSuccessClaimsCount(response.data.pageData.length);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPendingClaims = async () => {
    try {
      const response = await getAllClaims({
        searchCondition: {
          claim_status: "Pending Approval",
          is_delete: false,
          keyword: "",
          project_start_date: "",
          project_end_date: "",
        },
        pageInfo: { pageNum: 1, pageSize: 10 },
      });
      setPendingClaimsCount(response.data.pageData.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClaims();
    fetchDraftClaims();
    fetchPendingClaims();
    fetchSuccessClaims();
  }, []);

  return (
    <>
      <div className="flex items-center justify-end w-full mb-10">
        <button
          className="bg-[#FFB17A] text-white px-6 py-2 rounded-full hover:bg-[#FF9147] flex items-center gap-2 text-sm"
          onClick={handleOpenModalAddNewClaim}
        >
          <span>+</span>
          Add New Claim
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Icons.FormIcon className="text-3xl text-blue-600" />}
          label="Created Claims"
          value={ClaimsCount}
          bgColor="bg-gradient-to-b from-blue-300 to-blue-100"
          textColor="text-black-900 font-bold"
        />
        <StatCard
          icon={<Icons.Email className="text-3xl text-orange-500" />}
          label="Draft Claims"
          value={draftClaimsCount}
          bgColor="bg-gradient-to-b from-orange-300 to-orange-100"
          textColor="text-black-900 font-bold"
        />
        <StatCard
          icon={<Icons.Pending className="text-3xl text-yellow-500" />}
          label="Pending Claims"
          value={pendingClaimsCount}
          bgColor="bg-gradient-to-b from-yellow-300 to-yellow-100"
          textColor="text-black-900 font-bold"
        />
        <StatCard
          icon={<Icons.CircleCheck className="text-3xl text-green-600" />}
          label="Success Claims"
          value={successClaimsCount}
          bgColor="bg-gradient-to-b from-green-300 to-green-100"
          textColor="text-black-900 font-bold"
        />
      </div>

      <div className="col-span-4 p-4 rounded-lg">
        <h3 className="text-lg font-bold">History Transaction</h3>
        <table className="min-w-full border-separate border-spacing-y-2.5 border-0 text-black w-full">
          <thead className="bg-brand-gradient h-[70px] text-lg text-white">
            <tr className="bg-[linear-gradient(45deg,#FEB78A,#FF914D)]">
              <th className="px-4 py-2 rounded-tl-2xl">Claim Name</th>
              <th className="px-4 py-2 border-l-2 border-white">Start Date</th>
              <th className="px-4 py-2 border-l-2 border-white">End Date</th>
              <th className="px-4 py-2 border-l-2 border-white">Total Hours</th>
              <th className="px-4 py-2 border-l-2 border-white">Status</th>
              <th className="px-4 py-2 border-l-2 border-white rounded-tr-2xl">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : claimsData.length > 0 ? (
              claimsData
                .sort(
                  (a, b) =>
                    new Date(b.start_date).getTime() -
                    new Date(a.start_date).getTime()
                )
                .slice(0, 3)
                .map((item) => (
                  <tr
                    key={item.key}
                    className="h-[70px] bg-white text-center hover:shadow-brand-orange rounded-2xl"
                  >
                    <td className="request-table-cell px-4 py-2 rounded-l-2xl">
                      {item.claimname}
                    </td>
                    <td className="request-table-cell px-4 py-2">
                      {item.start_date}
                    </td>
                    <td className="request-table-cell px-4 py-2">
                      {item.end_date}
                    </td>
                    <td className="request-table-cell px-4 py-2">
                      <div className="request-table-hours flex flex-col items-center">
                        <span className="font-semibold text-[#FF914D]">
                          {item.total_work_time} hours
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2">{item.status}</td>
                    <td className="request-table-cell px-4 py-2 rounded-r-2xl">
                      <div className="request-table-actions flex justify-center gap-2">
                        <Button
                          className="!border-none"
                          onClick={() => navigate("/user/request")}
                          title="View Calendar"
                        >
                          <CalendarIcon size={18} color="#FF914D" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
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
