import React from 'react';
import { Button, Tag, Input, Pagination } from 'antd';
import { Trash, Edit, UserCheck } from 'lucide-react';
import { CheckOutlined } from "@ant-design/icons";

interface ClaimRequest {
  key: string;
  project: string;
  date: string;
  totalHours: string;
  timeFrom: string;
  timeTo: string;
  status: string;
}

interface TableRequestProps {
  data: ClaimRequest[];
  currentPage: number;
  pageSize: number;
  statusFilter: string | null;
  onEdit: (record: ClaimRequest) => void;
  onDelete: (record: ClaimRequest) => void;
  onStatusChange: (status: string) => void;
  onSearch: (value: string) => void;
  onPageChange: (page: number, pageSize?: number) => void;
  searchText: string;
}

const TableRequest: React.FC<TableRequestProps> = ({
  data,
  currentPage,
  pageSize,
  statusFilter,
  onEdit,
  onDelete,
  onStatusChange,
  onSearch,
  onPageChange,
  searchText,
}) => {
  const statusTags = ["All","Draft", "Waiting", "Approved", "Rejected"];

  const filteredData = data.filter((item) => {
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    const matchesSearch = item.project.toLowerCase().includes(searchText.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          {statusTags.map((status) => (
            <Tag
              key={status}
              color={statusFilter === status || (status === "All" && statusFilter === null) ? "#ff914d" : "default"}
              onClick={() => onStatusChange(status)}
              className="cursor-pointer !px-2 !py-1 !font-squada !text-lg !rounded-lg"
            >
              {(statusFilter === status || (status === "All" && statusFilter === null)) && <CheckOutlined className="inline-flex" />} {status}
            </Tag>
          ))}
        </div>
        <div className="w-[250px] height-[48px] overflow-hidden rounded-full border-[1px] border-gray-300 bg-white">
          <Input.Search
            placeholder="Search project name"
            onSearch={onSearch}
            onChange={(e) => onSearch(e.target.value)}
            style={{ width: 250 }}
            size="large"
            className="custom-search"
          />
        </div>
      </div>

      <table className="min-w-full !border-separate border-spacing-y-2.5 text-black border-0">
        <thead className="bg-brand-grandient h-[70px] text-lg text-white !rounded-t-lg">
          <tr className="bg-gradient from-[FEB78A] to-[FF914D]">
            <th className="border-white px-4 py-2 !rounded-tl-2xl">Project</th>
            <th className="border-l-2 border-white px-4 py-2">Date</th>
            <th className="border-l-2 border-white px-4 py-2">Total Hours</th>
            <th className="border-l-2 border-white px-4 py-2">Status</th>
            <th className="border-l-2 border-white px-4 py-2 !rounded-tr-2xl">Action</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {currentData.map((item, index) => (
            <tr
              key={index}
              className="h-[70px] bg-white overflow-hidden text-center border-collapse hover:shadow-brand-orange !rounded-2xl"
            >
              <td className="px-4 py-2 rounded-l-2xl">{item.project}</td>
              <td className="px-4 py-2">{item.date}</td>
              <td className="px-4 py-2">
                <div className="flex flex-col items-center">
                  <span className="text-gray-700">{`(${item.timeFrom}-${item.timeTo})`}</span>
                  <span className="font-semibold text-[#FF914D]">{item.totalHours} hours</span>
                </div>
              </td>
              <td className="px-4 py-2">
                <span className={`${item.status === 'Approved' ? 'text-green-600' : item.status === 'Rejected' ? 'text-red-600' : item.status === 'Draft' ? 'text-gray-600' : 'text-yellow-600'} font-semibold`}>
                  {item.status}
                </span>
              </td>
              <td className="action px-4 py-2 rounded-r-2xl">
                <div className="w-full flex justify-center gap-2 items-center space-x-2">
                  {item.status !== 'Approved' && item.status !== 'Rejected' && (
                    <>
                      <Button
                        className="!bg-none !border-none"
                        onClick={() => onEdit(item)}
                      >
                        <Edit size={24} color="#FF914D" strokeWidth={3} className="hover:bg-orange-200 overflow-hidden" />
                      </Button>
                      <Button
                        className="!bg-none !border-none"
                        onClick={() => onDelete(item)}
                      >
                        <Trash size={24} color="red" strokeWidth={3} className="hover:bg-red-200 overflow-hidden" />
                      </Button>
                      <Button className="!bg-none !border-none">
                        <UserCheck size={24} color="green" strokeWidth={3} className="hover:bg-green-200 overflow-hidden" />
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredData.length}
          onChange={onPageChange}
          showSizeChanger
        />
      </div>
    </div>
  );
};

export default TableRequest;
