import React from "react";
import { FaSearch, FaCalendarAlt, FaFilter, FaDownload } from "react-icons/fa";

const FinancePage: React.FC = () => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Finance Management</h1>
      <div className="flex justify-between items-center">
        <div className="flex-1 flex items-center space-x-2">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            name="search"
            placeholder="Type to search..."
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="flex gap-4">
          <span className="flex items-center">
            Export <FaDownload className="ml-2" />
          </span>
          <span className="flex items-center">
            Date <FaCalendarAlt className="ml-2" />
          </span>
          <span className="flex items-center">
            <FaFilter />
          </span>
        </div>
      </div>
    </>
  );
};

export default FinancePage;
