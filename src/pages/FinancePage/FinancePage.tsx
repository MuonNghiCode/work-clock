import React, { useEffect, useState } from "react";
import { FaSearch, FaDownload, FaCalendarAlt } from "react-icons/fa";
import { DateRangePicker, Range } from "react-date-range";
import { format, differenceInHours, parseISO } from "date-fns";
import Icons from "../../components/icon";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import PaymentModal from "../../components/PaymentModal/PaymentModal";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Pagination } from "antd";
import StatusModal from "../../components/PaymentModal/StatusModal";
import { getFinanceData } from "../../services/financeService";
import { getUserInfobyToken } from "../../services/authService";

// Define the expected type for the API response items
interface FinanceData {
  _id: string;
  staff_name: string;
  staff_email: string;
  employee_info: {
    account: string;
    full_name: string;
    department_name: string;
    salary: number;
    start_date: string;
  };
  approval_info: {
    user_name: string;
    email: string;
    role_code: string;
  };
  project_info: {
    project_name: string;
    project_code: string;
    project_department: string;
  };
  claim_name: string;
  claim_start_date: string;
  claim_end_date: string;
  claim_status: string;
  created_at: string;
}

const calculateHours = (startDate: string, endDate: string): number => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  return differenceInHours(end, start);
};

const FinancePage: React.FC = () => {
  const [dataFinance, setDataFinance] = useState<FinanceData[]>([]);
  const [useApiData, setUseApiData] = useState(true);
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: undefined,
      endDate: undefined,
      key: "selection",
    },
  ]);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FinanceData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [originalData, setOriginalData] = useState<FinanceData[]>([]);
  const [accountantEmail, setAccountantEmail] = useState<string>("");

  useEffect(() => {
    console.log("Using API Data:", useApiData);
    const fetchData = async () => {
      if (useApiData) {
        const request = {
          searchCondition: {
            keyword: searchQuery,
            claim_status: "",
            claim_start_date: "",
            claim_end_date: "",
            is_delete: false,
          },
          pageInfo: {
            pageNum: currentPage,
            pageSize: pageSize,
          },
        };

        try {
          const response = await getFinanceData(request);
          console.log("API Response:", response);
          if (response.success && response.data?.pageData) {
            console.log("Page Data:", response.data.pageData);
            setDataFinance(response.data.pageData);
            setOriginalData(response.data.pageData);
          } else {
            console.error("Invalid data or response:", response);
          }
        } catch (error) {
          console.error("Error fetching finance data:", error);
        }
      } else {
        const staticData: FinanceData[] = [
          {
            _id: "1",
            staff_name: "John Doe",
            staff_email: "john@example.com",
            employee_info: {
              account: "123",
              full_name: "John Doe",
              department_name: "Finance",
              salary: 50000,
              start_date: "2023-01-01",
            },
            approval_info: {
              user_name: "Jane Smith",
              email: "jane@example.com",
              role_code: "manager",
            },
            project_info: {
              project_name: "Project X",
              project_code: "PX123",
              project_department: "Development",
            },
            claim_name: "Travel",
            claim_start_date: "2023-01-10",
            claim_end_date: "2023-01-15",
            claim_status: "Pending",
            created_at: "2023-01-05",
          },
        ];
        setDataFinance(staticData);
      }
    };

    fetchData();
  }, [currentPage, pageSize, searchQuery, useApiData]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await getUserInfobyToken();
      if (response.success && response.data) {
        setAccountantEmail(response.data.email);
      }
    };

    fetchUserInfo();
  }, []);

  const toggleDataSource = () => {
    setUseApiData((prev) => !prev);
    console.log("Toggled useApiData to:", !useApiData);
  };

  const toggleDatePicker = () => {
    setIsDatePickerVisible(!isDatePickerVisible);
  };

  const defaultDateFormat = "dd/mm/yy";
  const formattedStartDate = dateRange[0].startDate
    ? format(dateRange[0].startDate, "dd/MM/yy")
    : defaultDateFormat;
  const formattedEndDate = dateRange[0].endDate
    ? format(dateRange[0].endDate, "dd/MM/yy")
    : defaultDateFormat;

  const clearDateFilter = () => {
    setDateRange([
      {
        startDate: undefined,
        endDate: undefined,
        key: "selection",
      },
    ]);
    // Khôi phục lại dữ liệu ban đầu
    setDataFinance(originalData);
  };

  const handlePay = (item: FinanceData) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleConfirmPayment = () => {
    if (selectedItem) {
      console.log(`Payment confirmed for item: ${selectedItem._id}`);
      setIsModalVisible(false);
      setIsStatusModalVisible(true);
      setSelectedItem(null);
    }
  };

  const handleDownload = (items?: FinanceData[]) => {
    const dataToDownload = items
      ? items.map((item) => ({
          Project: item.project_info.project_name,
          Claimer: item.staff_name,
          Approver: item.approval_info.user_name,
          Time: calculateHours(item.claim_start_date, item.claim_end_date),
          DateCreate: item.created_at,
        }))
      : dataFinance.map((item) => ({
          Project: item.project_info.project_name,
          Claimer: item.staff_name,
          Approver: item.approval_info.user_name,
          Time: calculateHours(item.claim_start_date, item.claim_end_date),
          DateCreate: item.created_at,
        }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("FinanceData");

    worksheet.columns = [
      { header: "Project", key: "Project" },
      { header: "Claimer", key: "Claimer" },
      { header: "Approver", key: "Approver" },
      { header: "Time", key: "Time" },
      { header: "Date Create", key: "DateCreate" },
    ];

    worksheet.addRows(dataToDownload);

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Finance_Data.xlsx");
    });
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  const handleStatusChange = (newStatus: "success" | "error" | null) => {
    setStatus(newStatus);
  };

  const handleStatusModalClose = () => {
    setIsStatusModalVisible(false);
    setStatus(null);
  };

  return (
    <div className="!mx-auto !p-1">
      <h1 className="text-[40px] font-bold mb-2">Finance Management</h1>
      <button onClick={toggleDataSource}>
        {useApiData ? "Use Static Data" : "Use API Data"}
      </button>
      <div className="flex flex-row justify-between items-center py-2">
        <div className="flex items-center space-x-2 bg-white w-70 sm:w-1/3 md:w-70 mb-3 md:mb-0 h-10 rounded-xl px-2 transition-all">
          <FaSearch className="text-gray-400 ml-2" />
          <input
            type="text"
            name="search"
            placeholder="Type to search..."
            className="w-full border-transparent text-gray-400 outline-none p-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex items-center space-x-2 bg-[#ff8a65] rounded-full w-20px h-10 p-2 px-4 relative">
            <span className="p-2">
              <FaCalendarAlt />
            </span>
            <button
              onClick={toggleDatePicker}
              className="cursor-pointer bg-none px-2 py-2 rounded"
            >
              <span className="lg:hidden">Date</span>
              <span className="hidden lg:inline">
                {formattedStartDate} - {formattedEndDate}
              </span>
            </button>
            {isDatePickerVisible && (
              <div className="absolute top-full mt-2 bg-white shadow-lg p-2 rounded-md z-50 right-0 sm:right-0 sm:left-auto">
                <DateRangePicker
                  ranges={dateRange}
                  onChange={(ranges) => {
                    setDateRange([ranges.selection]);
                    if (
                      ranges.selection.startDate !== undefined &&
                      ranges.selection.endDate !== undefined
                    ) {
                      const filteredData = originalData.filter((item) => {
                        const startDate = parseISO(item.claim_start_date);
                        const endDate = parseISO(item.claim_end_date);
                        return (
                          ranges.selection.startDate !== undefined &&
                          ranges.selection.endDate !== undefined &&
                          startDate >= ranges.selection.startDate &&
                          endDate <= ranges.selection.endDate
                        );
                      });
                      setDataFinance(filteredData);
                    }
                  }}
                />
              </div>
            )}
            <button
              onClick={clearDateFilter}
              className="bg-none px-2 cursor-pointer rounded-3xl mr-2"
            >
              x
            </button>
          </div>
          <button
            onClick={() => handleDownload()}
            className="flex items-center justify-center bg-[#ff8a65] rounded-full gap-2 w-25 h-10 cursor-pointer"
          >
            <span className="hidden sm:inline">Export</span>
            <span>
              <FaDownload className="!mx-auto !p-0.5" />
            </span>
          </button>
        </div>
      </div>
      <table className="min-w-full border-separate border-spacing-y-2.5 border-0 text-black">
        <thead className="bg-brand-gradient h-[70px] text-lg text-white !rounded-t-lg">
          <tr className="bg-[linear-gradient(45deg,#FEB78A,#FF914D)]">
            <th className="border-white px-4 py-2 !rounded-tl-2xl">Project</th>
            <th className="border-l-2 border-white px-4 py-2">Claim Name</th>
            <th className="border-l-2 border-white px-4 py-2">Claimer</th>
            <th className="border-l-2 border-white px-4 py-2">Approver</th>
            <th className="border-l-2 border-white px-4 py-2">Time</th>
            <th className="border-l-2 border-white px-4 py-2">Date Create</th>
            <th className="border-l-2 border-white px-4 py-2 !rounded-tr-2xl">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="w-full">
          {dataFinance.map((item) => (
            <tr
              key={item._id}
              className="h-[70px] bg-white overflow-hidden text-center border-collapse hover:shadow-brand-orange !rounded-2xl"
            >
              <td className="px-4 py-2 rounded-l-2xl">
                {item.project_info.project_name}
              </td>
              <td className="px-4 py-2">{item.claim_name}</td>
              <td className="px-4 py-2">{item.staff_name}</td>
              <td className="px-4 py-2">{item.approval_info.user_name}</td>
              <td className="px-4 py-2">
                {calculateHours(item.claim_start_date, item.claim_end_date)}h
              </td>
              <td className="px-4 py-2">
                {format(new Date(item.created_at), "dd/MM/yyyy")}
              </td>
              <td className="action px-4 py-4 rounded-r-lg flex justify-center space-x-1">
                <button
                  className="flex items-center justify-center h-10 w-28 bg-green-500 text-white rounded-lg shadow-md cursor-pointer"
                  onClick={() => handlePay(item)}
                >
                  <Icons.Dollar className="mr-1" />
                  <span className="hidden sm:inline">Pay</span>
                </button>
                <button
                  className="flex items-center justify-center h-10 w-28 bg-orange-500 text-white rounded-lg shadow-md cursor-pointer"
                  onClick={() => handleDownload([item])}
                >
                  <FaDownload className="mr-1" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <Pagination
          className="!font-squada flex justify-end "
          current={currentPage}
          total={dataFinance.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger
          onShowSizeChange={handlePageChange}
        />
      </div>
      {selectedItem && (
        <PaymentModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onConfirm={handleConfirmPayment}
          onStateChange={handleStatusChange}
          claimer={selectedItem.staff_name}
          email={selectedItem.staff_email}
          accountantEmail={accountantEmail}
          date={new Date(selectedItem.created_at)}
        />
      )}
      {status && (
        <StatusModal
          isModalVisible={isStatusModalVisible}
          type={status}
          date={format(new Date(), "dd/MM/yyyy")}
          onClose={handleStatusModalClose}
        />
      )}
    </div>
  );
};

export default FinancePage;

declare module "react-date-range";
