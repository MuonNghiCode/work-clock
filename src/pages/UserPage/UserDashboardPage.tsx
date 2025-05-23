import { useEffect, useState } from "react";
import { Button } from "antd";
import ModalAddNewClaim from "../../components/UserComponents/ModalAddNewClaim";
import { motion } from "framer-motion";
import Icons from "../../components/icon";
import { getClaimerSearch } from "../../services/claimService";
import { useNavigate } from "react-router-dom";
import { ResponseModel } from "../../models/ResponseModel";
import {
  ClaimItem,
  PageInfoRequest,
  SearchCondition,
} from "../../types/ClaimType";

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
  const [currentPage] = useState(1);
  const [pageSize] = useState(3);
  const [isOpenModalAddNewClaim, setIsOpenModalAddNewClaim] = useState(false);
  const [claimsData, setClaimsData] = useState<ClaimRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [MainClaimsCount, setMainClaimsCount] = useState(0);
  const [draftClaimsCount, setDraftClaimsCount] = useState(0);
  const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
  const [successClaimsCount, setSuccessClaimsCount] = useState(0);
  const navigate = useNavigate();

  const handleOpenModalAddNewClaim = () => setIsOpenModalAddNewClaim(true);
  const handleCloseModalAddNewClaim = () => setIsOpenModalAddNewClaim(false);

  const fetchMainClaims = async () => {
    try {
      const response = await getClaimerSearch(
        {
          keyword: "",
          claim_status: "",
          is_delete: false,
          claim_start_date: "",
          claim_end_date: "",
        },
        { pageNum: 1, pageSize: 30 }
      );
      setMainClaimsCount(response.data.pageData.length);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const searchCondition: SearchCondition = {
        keyword: "",
        claim_status: "",
        claim_start_date: "",
        claim_end_date: "",
        is_delete: false,
      };
      const pageInfo: PageInfoRequest = { pageNum: currentPage, pageSize };

      const response: ResponseModel<{
        pageData: ClaimItem[];
        pageInfo: PageInfoRequest;
      }> = await getClaimerSearch(searchCondition, pageInfo);

      if (response.success) {
        const claims = response.data.pageData.map((item) => ({
          key: item._id,
          claimname: item.claim_name,
          project: item.project_info?.project_name || "N/A",
          start_date: item.claim_start_date
            ? new Date(item.claim_start_date).toLocaleDateString("en-US")
            : "N/A",
          end_date: item.claim_end_date
            ? new Date(item.claim_end_date).toLocaleDateString("en-US")
            : "N/A",
          total_work_time: String(item.total_work_time || "0"),

          timeFrom: item.claim_start_date
            ? new Date(item.claim_start_date).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "N/A",
          timeTo: item.claim_end_date
            ? new Date(item.claim_end_date).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "N/A",
          status: item.claim_status || "Unknown",
          // approval_name: item.approval_name || "N/A",
        }));

        // Sort claims by `start_date` in descending order
        const sortclaims = claims.sort((a, b) => {
          const dateA = new Date(a.start_date).getTime();
          const dateB = new Date(b.start_date).getTime();
          return dateB - dateA;
        });

        setClaimsData(sortclaims);
      } else {
        console.warn("API returned no data for this search:", searchCondition);
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDraftClaims = async () => {
    try {
      const response = await getClaimerSearch(
        {
          keyword: "",
          claim_status: "Draft",
          is_delete: false,
          claim_start_date: "",
          claim_end_date: "",
        },
        { pageNum: 1, pageSize: 30 }
      );
      setDraftClaimsCount(response.data.pageData.length);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSuccessClaims = async () => {
    try {
      const response = await getClaimerSearch(
        {
          keyword: "",
          claim_status: "Paid",
          is_delete: false,
          claim_start_date: "",
          claim_end_date: "",
        },
        { pageNum: 1, pageSize: 30 }
      );
      setSuccessClaimsCount(response.data.pageData.length);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPendingClaims = async () => {
    try {
      const response = await getClaimerSearch(
        {
          keyword: "",
          claim_status: "Pending Approval",
          is_delete: false,
          claim_start_date: "",
          claim_end_date: "",
        },
        { pageNum: 1, pageSize: 30 }
      );
      setPendingClaimsCount(response.data.pageData.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClaims();
    fetchMainClaims();
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
          value={MainClaimsCount}
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
              claimsData.slice(0, 3).map((item) => (
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
                        title="View Details"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#FF914D"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-chart-column"
                        >
                          <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                          <path d="M18 17V9"></path>
                          <path d="M13 17V5"></path>
                          <path d="M8 17v-3"></path>
                        </svg>
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
