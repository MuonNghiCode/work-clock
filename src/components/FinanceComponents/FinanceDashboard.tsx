import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getClaimsData } from "../../services/claimService";
import Icons from "../../components/icon";
import AOS from "aos";
import "aos/dist/aos.css";
import moment from "moment";
import { motion } from "framer-motion";
import { formatCurrency } from "../../utils/formatCurrency";

const fadeInScaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
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
    className={`rounded-2xl flex flex-col items-center justify-center ${bgColor} bg-opacity-50 shadow-lg w-full text-center hover:scale-105 transition duration-300 p-5`}
    data-aos="fade-down"
    data-aos-duration="1000"
  >
    {icon && (
      <div className="p-3 mb-4 rounded-full bg-white bg-opacity-30">{icon}</div>
    )}
    <p className={`text-xl font-medium ${textColor}`}>{label}</p>
    <p className={`text-4xl font-bold ${textColor}`}>{value}</p>
  </motion.div>
);

// Định nghĩa interface cho dữ liệu
interface ClaimData {
  _id: string;
  project_info: {
    project_name: string;
  };
  employee_info: {
    full_name: string;
    salary: number;
  };
  approval_info: {
    user_name: string;
  };
  claim_start_date: string;
  claim_end_date: string;
  status: string;
  claim_name: string;
}
const FinanceDashboard: React.FC = () => {
  const [data, setData] = useState<ClaimData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingClaims, setPendingClaims] = useState(0);
  const [processedClaims, setProcessedClaims] = useState(0);
  const [averageProcessingTime, setAverageProcessingTime] = useState<
    number | null
  >(null);
  const [moneyFlowData, setMoneyFlowData] = useState({
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Money Flow",
        data: Array(12).fill(0), // Khởi tạo mảng với 12 tháng
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });
  const [claimsOrderData, setClaimsOrderData] = useState({
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Claims Order",
        data: Array(12).fill(0), // Khởi tạo mảng với 12 tháng
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  });
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Get the current date and time, then adjust for Vietnam's time zone (UTC+7)
      const currentDate = moment().utcOffset(7);
      const currentMonth = currentDate.month() + 1;

      console.log("Current month (Vietnam time zone):", currentMonth);

      const request = {
        searchCondition: {
          keyword: "",
          claim_status: "",
          claim_start_date: "",
          claim_end_date: "",
          is_delete: false,
        },
        pageInfo: {
          pageNum: 1,
          pageSize: 10000000,
        },
      };

      try {
        const response = await getClaimsData(request);
        if (response.success && response.data?.pageData) {
          const formattedData: ClaimData[] = response.data.pageData.map(
            (item) => ({
              _id: item._id,
              project_info: {
                project_name: item.project_info.project_name,
              },
              employee_info: {
                full_name: item.staff_name,
                salary: item.employee_info ? item.employee_info.salary : 0,
              },
              approval_info: {
                user_name: item.approval_info.user_name,
              },
              claim_start_date: item.claim_start_date,
              claim_end_date: item.claim_end_date,
              status: item.claim_status,
              claim_name: item.claim_name,
            })
          );

          // Tính tổng lương cho từng tháng
          const monthlySalaries = Array(12).fill(0); // Mảng để lưu tổng lương theo tháng
          formattedData.forEach((item) => {
            const claimDate = moment(item.claim_start_date).utcOffset(7);
            const monthIndex = claimDate.month(); // Lấy chỉ số tháng (0-11)
            if (item.status === "Paid") {
              monthlySalaries[monthIndex] += item.employee_info.salary; // Cộng lương vào tháng tương ứng
            }
          });

          // Cập nhật moneyFlowData
          setMoneyFlowData((prevData) => ({
            ...prevData,
            datasets: [
              {
                ...prevData.datasets[0],
                data: monthlySalaries, // Cập nhật dữ liệu với tổng lương theo tháng
              },
            ],
          }));

          // Tính số lượng claim theo tháng cho trạng thái "Approved" và "Paid"
          const monthlyClaims = Array(12).fill(0); // Mảng để lưu số lượng claim theo tháng
          formattedData.forEach((item) => {
            const claimDate = moment(item.claim_start_date).utcOffset(7);
            const monthIndex = claimDate.month(); // Lấy chỉ số tháng (0-11)

            // Kiểm tra trạng thái và tăng số lượng claim vào tháng tương ứng
            if (item.status === "Approved" || item.status === "Paid") {
              monthlyClaims[monthIndex] += 1; // Tăng số lượng claim vào tháng tương ứng
            }
          });

          // Cập nhật claimsOrderData
          setClaimsOrderData((prevData) => ({
            ...prevData,
            datasets: [
              {
                ...prevData.datasets[0],
                data: monthlyClaims, // Cập nhật dữ liệu với số lượng claim theo tháng
              },
            ],
          }));

          const totalRevenue = formattedData.reduce(
            (sum, item) => sum + item.employee_info.salary,
            0
          );
          const pendingClaims = formattedData.filter(
            (item) => item.status === "Approved"
          ).length;
          const processedClaims = formattedData.filter(
            (item) => item.status === "Paid"
          ).length;

          // Calculate average processing time
          const processingTimes = formattedData
            .filter((item) => item.status === "Paid" && item.claim_end_date)
            .map((item) => {
              const startDate = moment(item.claim_start_date).utcOffset(7);
              const endDate = moment(item.claim_end_date).utcOffset(7);
              return endDate.diff(startDate, "days");
            });

          const averageTime =
            processingTimes.length > 0
              ? processingTimes.reduce((sum, time) => sum + time, 0) /
                processingTimes.length
              : 0;

          setData(formattedData);
          setTotalRevenue(totalRevenue);
          setPendingClaims(pendingClaims);
          setProcessedClaims(processedClaims);
          setAverageProcessingTime(averageTime);
        } else {
          console.error("Invalid data or response:", response);
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="py-2">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={<Icons.Dollar className="text-3xl text-blue-600" />}
            label="Total Revenue"
            value={formatCurrency(totalRevenue)}
            bgColor="bg-gradient-to-b from-blue-300 to-blue-100"
            textColor="text-black-900 font-bold"
          />
          <StatCard
            icon={<Icons.Pending className="text-3xl text-yellow-500" />}
            label="Pending Claims"
            value={pendingClaims.toString()}
            bgColor="bg-gradient-to-b from-yellow-300 to-yellow-100"
            textColor="text-black-900 font-bold"
          />
          <StatCard
            icon={<Icons.Check className="text-3xl text-green-600" />}
            label="Processed Claims"
            value={processedClaims.toString()}
            bgColor="bg-gradient-to-b from-green-300 to-green-100"
            textColor="text-black-900 font-bold"
          />
          <StatCard
            icon={<Icons.Clock className="text-3xl text-orange-500" />}
            label="Average Processing Time"
            value={
              averageProcessingTime !== null
                ? parseFloat(averageProcessingTime.toFixed(2)).toString()
                : "0"
            }
            bgColor="bg-gradient-to-b from-orange-300 to-orange-100"
            textColor="text-black-900 font-bold"
          />
          <div
            data-aos="fade-down"
            data-aos-duration="1000"
            className="col-span-2 bg-gray-100 p-4 rounded-lg"
          >
            <h3 className="text-lg font-bold">Money Flow</h3>
            <Bar data={moneyFlowData} />
          </div>
          <div
            data-aos="fade-down"
            data-aos-duration="1000"
            className="col-span-2 bg-gray-100 p-4 rounded-lg"
          >
            <h3 className="text-lg font-bold">Claims Order</h3>
            <Bar data={claimsOrderData} />
          </div>
          <div className="col-span-4 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                History Transaction
              </h3>
              <button
                className={`px-4 py-2 rounded transition duration-300
                  ${
                    showAll
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  } 
                  text-white font-semibold`}
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Show Recent Only" : "View All"}
              </button>
            </div>
            <table className="min-w-full border-separate border-spacing-y-2.5 border-0 text-black w-full">
              <thead className="bg-brand-gradient h-[70px] text-lg text-white !rounded-t-lg">
                <tr className="bg-[linear-gradient(45deg,#FEB78A,#FF914D)]">
                  <th className="border-l-2 border-white px-4 py-2 !rounded-tl-2xl">
                    Claim Name
                  </th>
                  <th className="border-l-2 border-white px-4 py-2">Claimer</th>
                  <th className="border-l-2 border-white px-4 py-2">Salary</th>
                  <th className="border-l-2 border-white px-4 py-2">Status</th>
                  <th className="border-l-2 border-white px-4 py-2 !rounded-tr-2xl">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="w-full">
                {data
                  .filter((item) => item.status === "Paid")
                  .slice(
                    0,
                    showAll
                      ? data.filter((item) => item.status === "Paid").length
                      : 3
                  )
                  .map((item) => (
                    <tr
                      key={item._id}
                      className="h-[70px] bg-white overflow-scroll text-center border-collapse hover:shadow-brand-orange"
                    >
                      <td className="px-4 py-2 rounded-l-2xl">
                        {item.claim_name}
                      </td>
                      <td className="px-4 py-2">
                        {item.employee_info.full_name}
                      </td>
                      <td className="px-4 py-2">
                        {formatCurrency(item.employee_info.salary)}
                      </td>
                      <td className="px-4 py-2">{item.status}</td>
                      <td className="px-4 py-2 rounded-r-2xl">
                        {new Date(item.claim_start_date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceDashboard;
