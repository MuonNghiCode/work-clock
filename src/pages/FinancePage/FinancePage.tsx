import React from "react";
import { FaSearch } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";

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
];

const FinancePage: React.FC = () => {
  const handlePay = (key: string) => {
    console.log(`Payment processed for key: ${key}`);
  };

  return (
    <div className="!mx-auto !p-5">
      <h1 className="text-2xl font-bold mb-4">Finance Management</h1>
      <div className="flex justify-between items-center py-4">
        <div className="flex-1 flex items-center space-x-2 ">
          <FaSearch className="text-gray-400 mx-auto" />
          <input
            type="text"
            name="search"
            placeholder="Type to search..."
            className="input input-bordered w-full max-w-md bg-blue-100"
          />
        </div>
        <div className="flex gap-4">
          <button className="flex items-center justify-center bg-[#ff8a65] rounded-full w-15 h-8 !px-1">
            Export <FaDownload className="!mx-auto !p-0.5" />
          </button>
          <button className="flex items-center justify-center bg-[#ff8a65] rounded-full w-15 h-8 !px-1">
            Date <FaCalendarAlt className="!mx-auto !p-0.5" />
          </button>
          <button className="flex items-center justify-center bg-[#ff8a65] rounded-full w-8 h-8">
            <FaFilter />
          </button>
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
          {data.map((item) => (
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
                className={`px-4 py-2 border-t-2 border-b-2 ${
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
                    onClick={() => handlePay(item.key)}
                  >
                    Paid
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinancePage;
