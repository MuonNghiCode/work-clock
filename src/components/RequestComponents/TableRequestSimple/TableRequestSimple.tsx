import React from "react";

interface ClaimRequest {
  key: string;
  claimname: string;
  project: string;
  start_date: string;
  end_date: string;
  totalHours: string;
  timeFrom: string;
  timeTo: string;
  status: string;
  approval_name: string;
}

interface TableRequestSimpleProps {
  apiData: ClaimRequest[];
  loading: boolean;
}

const TableRequestSimple: React.FC<TableRequestSimpleProps> = ({
  apiData,
  loading,
}) => {
  const getStatusColor = (status: string) =>
    ({
      Approved: "text-green-600",
      Rejected: "text-red-600",
      Draft: "text-gray-600",
      "Pending Approval": "text-yellow-600",
      Canceled: "text-purple-600",
      Paid: "text-blue-600",
    }[status] || "text-gray-600");

  return (
    <div className="request-container">
      <div className="request-content flex flex-col">
        <div className="request-header mb-4">
          <table className="request-table min-w-full border-separate border-spacing-y-2.5">
            <thead className="request-table-header bg-gradient-to-r from-[#FEB78A] to-[#FF914D] h-[70px] text-lg text-white rounded-t-lg">
              <tr>
                <th className="request-table-header-cell px-4 py-2 rounded-tl-2xl">
                  Claim Name
                </th>
                <th className="request-table-header-cell px-4 py-2 border-l-2 border-white">
                  Start Date
                </th>
                <th className="request-table-header-cell px-4 py-2 border-l-2 border-white">
                  End Date
                </th>
                <th className="request-table-header-cell px-4 py-2 border-l-2 border-white">
                  Total Hours
                </th>
                <th className="request-table-header-cell px-4 py-2 border-l-2 border-white">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="request-table-loading text-center py-4"
                  >
                    Loading...
                  </td>
                </tr>
              ) : apiData.length > 0 ? (
                apiData.map((item) => (
                  <tr
                    key={item.key}
                    className="request-table-row h-[70px] bg-white text-center hover:shadow-brand-orange rounded-2xl cursor-pointer"
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
                        <span className="text-gray-700">{`(${item.timeFrom}-${item.timeTo})`}</span>
                        <span className="font-semibold text-[#FF914D]">
                          {item.totalHours} hours
                        </span>
                      </div>
                    </td>
                    <td className="request-table-cell px-4 py-2 rounded-r-2xl">
                      <span
                        className={`font-semibold ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="request-table-no-data text-center py-4"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableRequestSimple;
