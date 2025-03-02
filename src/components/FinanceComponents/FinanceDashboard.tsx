import React, { useEffect, useState } from "react";

const FinanceDashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([]); // Sử dụng any[] để bỏ kiểu DataType
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Tạm thời bỏ gọi API
  // const fetchData = async () => {
  //   setLoading(true);
  //   const requestPayload = {
  //     searchCondition: {
  //       keyword: "",
  //       claim_status: "",
  //       claim_start_date: "",
  //       claim_end_date: "",
  //       is_delete: false,
  //     },
  //     pageInfo: {
  //       pageNum: 1,
  //       pageSize: 10,
  //     },
  //   };

  //   try {
  //     const response = await getFinanceInfo(requestPayload);
  //     if (response.success) {
  //       setData(response.data.pageData); // Lưu dữ liệu đã được định dạng
  //     } else {
  //       throw new Error(response.message || "Failed to fetch finance data");
  //     }
  //   } catch (err) {
  //     console.error("Error fetching finance data:", err);
  //     setError((err as Error).message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchData(); // Gọi fetchData chỉ một lần khi component mount
  // }, []); // Đảm bảo mảng dependency rỗng

  // Tạm thời sử dụng dữ liệu tĩnh
  useEffect(() => {
    setLoading(true);
    // Dữ liệu tĩnh mẫu
    const sampleData = [
      {
        _id: "67c0300421edc39d51e3d6ba",
        project_info: {
          project_name: "FMJFA Family Mart3",
        },
        employee_info: {
          full_name: "danh235",
        },
        approval_info: {
          user_name: "approval group1",
        },
        claim_start_date: "2025-02-27T10:48:36.083Z",
        claim_end_date: "2025-02-27T14:48:36.083Z",
      },
    ];
    setData(sampleData);
    setLoading(false);
  }, []);

  const totalOrders = data.length;

  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="rounded-xl p-6">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="p-4 bg-blue-100 rounded-lg text-center mb-6">
            <h3 className="text-2xl font-bold text-blue-600">{totalOrders}</h3>
            <p className="text-sm text-gray-700">Total Orders</p>
          </div>
          <div className="data-container bg-gray-100 p-4 rounded-lg">
            {totalOrders > 0 ? (
              <ul>
                {data.map((item) => (
                  <li key={item._id} className="mb-2">
                    <strong>Project:</strong> {item.project_info.project_name},{" "}
                    <strong>Claimer:</strong> {item.employee_info.full_name},{" "}
                    <strong>Approver:</strong> {item.approval_info.user_name},{" "}
                    <strong>Time:</strong>{" "}
                    {`${new Date(
                      item.claim_start_date
                    ).toLocaleDateString()} - ${new Date(
                      item.claim_end_date
                    ).toLocaleDateString()}`}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <span className="text-4xl">📉</span>
                <p>No orders recorded</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FinanceDashboard;
