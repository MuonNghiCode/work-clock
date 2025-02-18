import React, { useEffect, useState } from "react";
import { FaSearch, FaDownload, FaCalendarAlt, FaFilter } from "react-icons/fa";
import { DateRangePicker, Range } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import PaymentModal from "../../components/PaymentModal/PaymentModal";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface DataType {
  key: string;
  project: string;
  claimer: string;
  time: string;
  status: "Approved" | "Reject";
  dateCreate: string;
}

const data: DataType[] = [
  {
    key: "1",
    project: "ProjectSample",
    claimer: "enteeccoy",
    time: "10 hours",
    status: "Approved",
    dateCreate: "28/02/2024",
  },
  {
    key: "2",
    project: "ProjectSample",
    claimer: "enteeccoy",
    time: "10 hours",
    status: "Approved",
    dateCreate: "28/02/2024",
  },
  {
    key: "3",
    project: "ProjectSample",
    claimer: "enteeccoy",
    time: "10 hours",
    status: "Reject",
    dateCreate: "28/02/2024",
  },
  {
    key: "4",
    project: "ProjectSample",
    claimer: "enteeccoy",
    time: "10 hours",
    status: "Approved",
    dateCreate: "28/02/2024",
  },
  {
    key: "5",
    project: "ProjectSample",
    claimer: "enteeccoy",
    time: "10 hours",
    status: "Reject",
    dateCreate: "28/02/2024",
  },
  {
    key: "6",
    project: "ProjectSample",
    claimer: "enteeccoy",
    time: "10 hours",
    status: "Reject",
    dateCreate: "28/02/2024",
  },
  {
    key: "7",
    project: "ProjectSample",
    claimer: "enteeccoy",
    time: "10 hours",
    status: "Reject",
    dateCreate: "28/02/2024",
  },
];

const FinancePage: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
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
  const [selectedItem, setSelectedItem] = useState<DataType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const filter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const filteredData = data.filter(
      (item: DataType) => item.status === selectedValue
    );
    setDataSource(filteredData);
    if (selectedValue === "None") {
      setDataSource(data);
    }
  };

  const filterByDateRange = () => {
    const { startDate, endDate } = dateRange[0];
    if (!startDate || !endDate) {
      setDataSource(data);
      return;
    }

    const filteredData = data.filter((item: DataType) => {
      const itemDate = new Date(item.dateCreate.split("/").reverse().join("-"));
      return itemDate >= startDate && itemDate <= endDate;
    });

    setDataSource(filteredData);
  };

  const clearDateFilter = () => {
    setDateRange([
      {
        startDate: undefined,
        endDate: undefined,
        key: "selection",
      },
    ]);
    setDataSource(data);
  };

  const handlePay = (item: DataType) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleConfirmPayment = () => {
    if (selectedItem) {
      console.log(`Payment confirmed for item: ${selectedItem.key}`);
      setIsModalVisible(false);
      setSelectedItem(null);
    }
  };

  useEffect(() => {
    setDataSource(data);
  }, [data]);

  useEffect(() => {
    filterByDateRange();
  }, [dateRange]);

  useEffect(() => {
    const filteredData = data.filter((item: DataType) =>
      item.claimer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDataSource(filteredData);
  }, [searchQuery]);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("FinanceData");

    worksheet.columns = [
      { header: "Project", key: "project" },
      { header: "Claimer", key: "claimer" },
      { header: "Time", key: "time" },
      { header: "Status", key: "status" },
      { header: "Date Create", key: "dateCreate" },
    ];

    worksheet.addRows(dataSource);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "FinanceData.xlsx");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataSource.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(dataSource.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="!mx-auto !p-5">
      <h1 className="text-[40px] font-bold mb-4">Finance Management</h1>
      <div className="flex justify-between items-center py-4">
        <div className="flex-1 flex items-center space-x-2 justify-start bg-blue-100 max-w-sm h-10 rounded">
          <span>
            <FaSearch className="text-gray-400 pl-1" />
          </span>
          <input
            type="text"
            name="search"
            placeholder="Type to search..."
            className="w-full border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={exportToExcel}
            className="flex items-center justify-center bg-[#ff8a65] rounded-full w-20 h-15 cursor-pointer"
          >
            <span>Export</span>
            <span>
              <FaDownload className="!mx-auto !p-0.5" />
            </span>
          </button>
          <div className="flex items-center space-x-2 bg-[#ff8a65] rounded-full p-2 relative">
            <span className="p-2">
              <FaCalendarAlt />
            </span>
            <button
              onClick={toggleDatePicker}
              className="cursor-pointer bg-none px-4 py-2 rounded"
            >
              {formattedStartDate} - {formattedEndDate}
            </button>
            {isDatePickerVisible && (
              <div className="absolute top-full right-0 mt-2 z-10">
                <DateRangePicker
                  ranges={dateRange}
                  onChange={(ranges) => setDateRange([ranges.selection])}
                />
              </div>
            )}
            <button
              onClick={clearDateFilter}
              className="bg-none cursor-pointer rounded mr-2"
            >
              x
            </button>
          </div>
          <div className="flex items-center space-x-2 bg-[#ff8a65] rounded-full p-2 h-15">
            <button className="flex items-center">
              <FaFilter className="!mx-auto !p-0.5" />
            </button>
            <label htmlFor="status-filter" className="sr-only">
              Filter by status
            </label>
            <select
              id="status-filter"
              className="input input-bordered bg-none w-15 h-10 mr-2 rounded"
              onChange={filter}
              defaultValue="None"
            >
              <option value="None">None</option>
              <option value="Approved">Approved</option>
              <option value="Reject">Reject</option>
            </select>
          </div>
        </div>
      </div>
      <table className="min-w-full border-separate border-spacing-y-2.5 border-gray-300 text-black">
        <thead className="bg-brand-gradient h-[100px] text-2xl">
          <tr className="bg-[linear-gradient(45deg,#FEB78A,#FF914D)]">
            <th className="border-white px-4 py-2">Project</th>
            <th className="border-l-2 border-white px-4 py-2">Claimer</th>
            <th className="border-l-2 border-white px-4 py-2">Time</th>
            <th className="border-l-2 border-white px-4 py-2">Status</th>
            <th className="border-l-2 border-white px-4 py-2">Date Create</th>
            <th className="border-l-2 border-white px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody className="w-full text-[20px]">
          {currentItems.map((item) => (
            <tr
              key={item.key}
              className="h-[100px] bg-white border-black border-2 rounded-lg text-center shadow-lg hover:shadow-2xl"
            >
              <td className="px-4 py-2 border-l-2 border-t-2 border-b-2 rounded-l-lg">
                {item.project}
              </td>
              <td className="px-4 py-2 border-t-2 border-b-2">
                {item.claimer}
              </td>
              <td className="px-4 py-2 border-t-2 border-b-2">{item.time}</td>
              <td
                className={`px-4 py-2 border-t-2 border-b-2 border-black ${
                  item.status === "Approved"
                    ? "text-green-500"
                    : item.status === "Reject"
                    ? "text-red-500"
                    : ""
                }`}
              >
                {item.status}
              </td>
              <td className="px-4 py-2 border-t-2 border-b-2">
                {item.dateCreate}
              </td>
              <td className="action px-4 py-2 border-r-2 border-t-2 border-b-2 rounded-r-lg">
                {item.status === "Approved" ? (
                  <button
                    className="h-full w-3/4 bg-green-500 text-white rounded px-2 py-1"
                    onClick={() => handlePay(item)}
                  >
                    Paid
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
      {selectedItem && (
        <PaymentModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onConfirm={handleConfirmPayment}
          claimer={selectedItem.claimer}
          date={selectedItem.dateCreate}
        />
      )}
    </div>
  );
};

export default FinancePage;

declare module "react-date-range";
