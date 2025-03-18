import React, { useEffect, useState, useRef } from "react";
import { FaSearch, FaDownload, FaCalendarAlt } from "react-icons/fa";
import { DateRangePicker, Range } from "react-date-range";
import { format, parseISO } from "date-fns";
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
import AOS from "aos";
import "aos/dist/aos.css";
import debounce from "lodash/debounce";

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
  total_work_time: number;
}

const FinancePage: React.FC = () => {
  const [dataFinance, setDataFinance] = useState<FinanceData[]>([]);
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

  const datePickerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = debounce((query) => {
    setSearchQuery(query);
  }, 500);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchQuery]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await getUserInfobyToken();
      if (response.success && response.data) {
        setAccountantEmail(response.data.email);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  const toggleDatePicker = () => {
    setIsDatePickerVisible(!isDatePickerVisible);
  };

  const defaultDateMessage = "Select Date Range";

  const formattedStartDate = dateRange[0].startDate
    ? format(dateRange[0].startDate, "dd/MM/yy")
    : defaultDateMessage;
  const formattedEndDate = dateRange[0].endDate
    ? format(dateRange[0].endDate, "dd/MM/yy")
    : defaultDateMessage;

  const clearDateFilter = () => {
    setDateRange([
      {
        startDate: undefined,
        endDate: undefined,
        key: "selection",
      },
    ]);
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
          Time: item.total_work_time,
          DateCreate: item.created_at,
        }))
      : dataFinance.map((item) => ({
          Project: item.project_info.project_name,
          Claimer: item.staff_name,
          Approver: item.approval_info.user_name,
          Time: item.total_work_time,
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
    fetchData();
  };

  return (
    <div className="!mx-auto !p-1">
      <div className="flex flex-row justify-between items-center py-2">
        <div className="flex gap-4">
          <div className="flex items-center space-x-2 border border-black text-black rounded-full w-20px h-10 p-2 px-4 relative">
            <span className="p-2">
              <FaCalendarAlt />
            </span>
            <button
              onClick={toggleDatePicker}
              className="cursor-pointer bg-none px-2 py-2 rounded"
            >
              <span className="lg:hidden">Date</span>
              <span className="hidden lg:inline">
                {dateRange[0].startDate && dateRange[0].endDate
                  ? `${formattedStartDate} - ${formattedEndDate}`
                  : defaultDateMessage}
              </span>
            </button>
            {isDatePickerVisible && (
              <div
                ref={datePickerRef}
                className="absolute top-full mt-2 bg-white shadow-lg p-2 rounded-md z-50 left-0 sm:right-0 "
              >
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
            className="flex items-center justify-center border border-black  rounded-full gap-2 w-25 h-10 cursor-pointer text-black"
          >
            <span className="hidden sm:inline">Export</span>
            <span>
              <FaDownload className="!mx-auto !p-0.5" />
            </span>
          </button>
        </div>
        <div
          className="flex items-center space-x-2 border border-black w-70 sm:w-1/3 md:w-70 mb-3 md:mb-0 h-10 rounded-xl px-2 transition-all not-first z-20"
          data-aos="fade-out"
          data-aos-duration="1000"
        >
          <FaSearch className="text-gray-400 ml-2" />
          <input
            type="text"
            name="search"
            placeholder="Type to search..."
            className="w-full border-transparent text-black outline-none p-2"
            defaultValue={searchQuery}
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>
      </div>
      <table
        data-aos="fade-down"
        data-aos-duration="1000"
        className="min-w-full border-separate border-spacing-y-2.5 border-0 text-black"
      >
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
              <td className="px-4 py-2">{item.total_work_time}h</td>
              <td className="px-4 py-2">
                {format(new Date(item.created_at), "dd/MM/yyyy")}
              </td>
              <td className="action px-4 py-4 rounded-r-lg flex justify-center space-x-1">
                <button
                  className="flex items-center justify-center h-10 w-20 text-green-300 rounded-lg cursor-pointer hover:text-green-600 hover:font-bold hover:scale-105 transition-colors duration-200"
                  onClick={() => handlePay(item)}
                >
                  <Icons.Dollar className="mr-1" />
                  <span className="hidden sm:inline"></span>
                </button>
                <button
                  className="flex items-center justify-center h-10 w-20 text-orange-300 rounded-lg cursor-pointer hover:text-orange-600 hover:font-bold hover:scale-105 transition-colors duration-200"
                  onClick={() => handleDownload([item])}
                >
                  <FaDownload className="mr-1" />
                  <span className="hidden sm:inline"></span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        {dataFinance.length > 0 && (
          <Pagination
            className="!font-squada flex justify-end"
            current={currentPage}
            total={dataFinance.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger
            onShowSizeChange={handlePageChange}
          />
        )}
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
          claim_name={selectedItem.claim_name}
          claimId={selectedItem._id}
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
