import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getClaimsData } from "../../services/claimService";
import Icons from "../../components/icon";
import AOS from "aos";
import "aos/dist/aos.css";

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
}
const FinanceDashboard: React.FC = () => {
  const [data, setData] = useState<ClaimData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingClaims, setPendingClaims] = useState(0);
  const [processedClaims, setProcessedClaims] = useState(0);
  const [newApprovedClaimsCount, setNewApprovedClaimsCount] = useState(0);
  const [averageProcessingTime, setAverageProcessingTime] = useState<
    number | null
  >(null);
  const [claimsOrderData, setClaimsOrderData] = useState({
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Claims Order",
        data: [0, 0, 0, 0],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  });

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
          pageSize: 10,
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
            })
          );

          const claimsPerWeek = [0, 0, 0, 0]; // Khởi tạo mảng cho 4 tuần
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();

          // Tính claims trong 4 tuẩn của tháng hiện tại (chart claims order)
          formattedData.forEach((item) => {
            if (item.status === "Approved" || item.status === "Paid") {
              const claimDate = new Date(item.claim_start_date);
              if (claimDate.getMonth() === currentMonth) {
                const weekIndex = Math.floor(claimDate.getDate() / 7);
                if (weekIndex < 4) {
                  claimsPerWeek[weekIndex] += 1;
                }
              }
            }
          });

          setClaimsOrderData((prevData) => ({
            ...prevData,
            datasets: [
              {
                ...prevData.datasets[0],
                data: claimsPerWeek,
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

          // Tính số lượng claims Approved trong tuần của tháng hiện tại
          const startOfWeek = new Date(
            currentDate.setDate(currentDate.getDate() - currentDate.getDay())
          );
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(endOfWeek.getDate() + 6);

          const newApprovedClaims = formattedData.filter((item) => {
            const claimDate = new Date(item.claim_start_date);
            return (
              item.status === "Approved" &&
              claimDate.getMonth() === currentMonth
            );
          }).length;

          // Tính thời gian xử lý trung bình
          const processingTimes = formattedData
            .filter((item) => item.status === "Paid" && item.claim_end_date)
            .map((item) => {
              const startDate = new Date(item.claim_start_date);
              const endDate = new Date(item.claim_end_date);
              return (
                (endDate.getTime() - startDate.getTime()) /
                (1000 * 60 * 60 * 24)
              ); // Tính số ngày
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
          setNewApprovedClaimsCount(newApprovedClaims);
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

  const moneyFlowData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Money Flow",
        data: [12000, 19000, 30000, 50000, 20000],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="py-2">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <div
            className="bg-gradient-to-b from-blue-300 to-blue-100 p-6 rounded-xl shadow-lg relative hover:shadow-xl hover:bg-blue-400 hover:border-blue-500 border-transparent border-2 transition-all duration-200"
            data-aos="fade-down"
            data-aos-duration="1000"
          >
            <h3 className="text-lg font-bold">Total Revenue</h3>
            <p className="text-3xl text-blue-600">${totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-500">+12.5% from last month</p>
            <span className="absolute bottom-2 right-4">
              <Icons.Dollar className="lg:w-16 w-12 h-auto text-blue-500" />
            </span>
          </div>
          <div
            className="bg-gradient-to-b from-yellow-300 to-yellow-100 p-6 rounded-xl shadow-lg relative hover:shadow-xl hover:bg-yellow-400 hover:border-yellow-500 border-transparent border-2 transition-all duration-200"
            data-aos="fade-down"
            data-aos-duration="1000"
          >
            <h3 className="text-lg font-bold">Pending Claims</h3>
            <p className="text-3xl text-blue-600">{pendingClaims}</p>
            <p className="text-sm text-gray-500">
              {newApprovedClaimsCount} new approved this month
            </p>
            <span className="absolute bottom-2 right-4">
              <Icons.Pending className="lg:w-16 w-12 h-auto text-yellow-500" />
            </span>
          </div>
          <div
            className="bg-gradient-to-b from-green-300 to-green-100 p-6 rounded-xl shadow-lg relative hover:shadow-xl hover:bg-green-400 hover:border-green-500 border-transparent border-2 transition-all duration-200"
            data-aos="fade-down"
            data-aos-duration="1000"
          >
            <h3 className="text-lg font-bold">Processed Claims</h3>
            <p className="text-3xl text-blue-600">{processedClaims}</p>
            <p className="text-sm text-gray-500">This month</p>
            <span className="absolute bottom-2 right-4">
              <Icons.Check className="lg:w-16 w-12 h-auto text-green-500" />
            </span>
          </div>
          <div
            className="bg-gradient-to-b from-orange-300 to-orange-100 p-6 rounded-xl shadow-lg relative hover:shadow-xl hover:bg-orange-400 hover:border-orange-500 border-transparent border-2 transition-all duration-200"
            data-aos="fade-down"
            data-aos-duration="1000"
          >
            <h3 className="text-lg font-bold">Average Processing Time</h3>
            <p className="text-3xl text-blue-600">
              {averageProcessingTime ? averageProcessingTime.toFixed(2) : "N/A"}{" "}
              days
            </p>
            <p className="text-sm text-gray-500">This week</p>
            <span className="absolute bottom-2 right-4">
              <Icons.Clock className="lg:w-16 w-12 h-auto text-orange-500" />
            </span>
          </div>
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
            <h3
              data-aos="fade-down"
              data-aos-duration="1000"
              className="text-lg font-bold"
            >
              History Transaction
            </h3>
            <table
              data-aos="fade-down"
              data-aos-duration="1000"
              className="min-w-full border-separate border-spacing-y-2.5 border-0 text-black w-full"
            >
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
              <tbody className="w-full">
                {data
                  .filter((item) => item.status === "Paid")
                  .map((item) => (
                    <tr
                      key={item._id}
                      className="h-[70px] bg-white overflow-scroll text-center border-collapse hover:shadow-brand-orange !rounded-2xl"
                    >
                      <td className="px-4 py-2 rounded-l-2xl">{item._id}</td>
                      <td className="px-4 py-2">
                        {item.employee_info.full_name}
                      </td>
                      <td className="px-4 py-2">
                        ${item.employee_info.salary}
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
