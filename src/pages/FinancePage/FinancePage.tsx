import React, { useEffect, useState } from "react";
import { FaSearch, FaDownload, FaCalendarAlt } from "react-icons/fa";
import { DateRangePicker, Range } from "react-date-range";
import { format } from "date-fns";
import Icons from "../../components/icon";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import PaymentModal from "../../components/PaymentModal/PaymentModal";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Pagination } from "antd";

export interface DataType {
  key: string;
  project: string;
  claimer: string;
  time: string;
  dateCreate: string;
}

export const data: DataType[] = [
  {
    key: "1",
    project: "ProjectSample",
    claimer: "enteeccoy",
    time: "10 hours",
    dateCreate: "28/02/2024",
  },
  {
    key: "2",
    project: "ProjectSample",
    claimer: "enteeccoy",
    time: "10 hours",
    dateCreate: "28/02/2024",
  },
  {
    key: "3",
    project: "ProjectSample",
    claimer: "enteeccoy",
    time: "10 hours",
    dateCreate: "28/02/2024",
  },
  {
    key: "4",
    project: "ProjectSample",
    claimer: "enteeccoy",
    time: "10 hours",
    dateCreate: "28/02/2024",
  },
  {
    key: "5",
    project: "ProjectSample",
    claimer: "enteeccoy",
    time: "10 hours",
    dateCreate: "28/02/2024",
  },
  {
    key: "6",
    project: "ProjectSample",
    claimer: "enteeccoy",
    time: "10 hours",
    dateCreate: "28/02/2024",
  },
  {
    key: "7",
    project: "ProjectSample",
    claimer: "enteeccoy",
    time: "10 hours",
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
  const [pageSize, setPageSize] = useState(10);

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

  const handleDownload = (item: DataType) => {
    const dataToDownload = [
      {
        Project: item.project,
        Claimer: item.claimer,
        Time: item.time,
        DateCreate: item.dateCreate,
      },
    ];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("DownloadData");

    worksheet.columns = [
      { header: "Project", key: "Project" },
      { header: "Claimer", key: "Claimer" },
      { header: "Time", key: "Time" },
      { header: "Date Create", key: "DateCreate" },
    ];

    worksheet.addRows(dataToDownload);

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `${item.project}_Data.xlsx`);
    });
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

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = dataSource.slice(startIndex, endIndex);
  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  return (
    <div className="!mx-auto !p-1">
      <h1 className="text-[40px] font-bold mb-2">Finance Management</h1>
      <div className="flex flex-col md:flex-row justify-between items-center py-2">
        <div className="flex items-center space-x-2 bg-white w-full sm:w-full mb-3 sm:mb-3 md:mb-0 md:max-w-70 h-10 rounded-xl px-2 transition-all">
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
              className="bg-none px-2 cursor-pointer rounded-3xl mr-2"
            >
              x
            </button>
          </div>
          <button
            onClick={exportToExcel}
            className="flex items-center justify-center bg-[#ff8a65] rounded-full gap-2 w-25 h-10 cursor-pointer"
          >
            <span>Export</span>
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
            <th className="border-l-2 border-white px-4 py-2">Claimer</th>
            <th className="border-l-2 border-white px-4 py-2">Time</th>
            <th className="border-l-2 border-white px-4 py-2">Date Create</th>
            <th className="border-l-2 border-white px-4 py-2 !rounded-tr-2xl">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="w-full">
          {currentItems.map((item) => (
            <tr
              key={item.key}
              className="h-[70px] bg-white overflow-hidden text-center border-collapse  hover:shadow-brand-orange !rounded-2xl "
            >
              <td className="px-4 py-2  rounded-l-2xl">{item.project}</td>
              <td className="px-4 py-2 ">{item.claimer}</td>
              <td className="px-4 py-2 ">{item.time}</td>
              <td className="px-4 py-2 ">{item.dateCreate}</td>
              <td className="action px-4 py-2 rounded-r-lg flex justify-center space-x-1">
                <button
                  className="flex items-center justify-center h-10 w-28 bg-green-500 text-white rounded-lg shadow-md cursor-pointer"
                  onClick={() => handlePay(item)}
                >
                  <Icons.Dollar className="mr-1" />
                  Pay
                </button>
                <button
                  className="flex items-center justify-center h-10 w-28 bg-orange-500 text-white rounded-lg shadow-md cursor-pointer"
                  onClick={() => handleDownload(item)}
                >
                  <FaDownload className="mr-1" />
                  Download
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
          total={dataSource.length}
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
          claimer={selectedItem.claimer}
          date={selectedItem.dateCreate}
        />
      )}
    </div>
  );
};

export default FinancePage;

declare module "react-date-range";
