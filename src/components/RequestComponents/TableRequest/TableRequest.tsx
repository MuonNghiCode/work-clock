import React, { useState, useEffect } from 'react';
import { Button, Tag, Input, Pagination, Modal } from 'antd';
import { Trash, Edit, UserCheck } from 'lucide-react';
import { CheckOutlined } from "@ant-design/icons";
import axiosInstance from '../../../config/axiosConfig'; 

interface ClaimRequest {
  key: string;
  project: string;
  claimname: string;
  date: string;
  totalHours: string;
  timeFrom: string;
  timeTo: string;
  status: string;
}

interface TableRequestProps {
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

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone 
  });
};

const calculateHours = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  return hours.toString();
};

const TableRequest: React.FC<TableRequestProps> = ({
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
  const [apiData, setApiData] = useState<ClaimRequest[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ClaimRequest | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const statusTags = ["All", "Draft", "Waiting", "Approved", "Rejected", "Canceled"];

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('claims/claimer-search', {
        searchCondition: {
          keyword: searchText,
          claim_status: statusFilter || '',
          claim_start_date: '',
          claim_end_date: '',
          is_delete: false
        },
        pageInfo: {
          pageNum: currentPage,
          pageSize: pageSize
        }
      });

      if (response.data.success) {
        const claims = response.data.data.pageData.map((item: any) => ({
          key: item._id,
          project: item.project_info.project_name,
          claimname: item.claim_name,
          date: new Date(item.claim_start_date).toLocaleDateString('vi-VN', { 
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }),
          timeFrom: formatTime(item.claim_start_date),
          timeTo: formatTime(item.claim_end_date),
          totalHours: calculateHours(item.claim_start_date, item.claim_end_date), // Tính toán từ start và end
          status: item.claim_status
        }));
        
        setApiData(claims);
        setTotalItems(response.data.data.pageInfo.totalItems);
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClaimById = async (id: string) => {
    try {
      const response = await axiosInstance.get(`claims/${id}`);
      if (response.data.success) {
        const claimData = response.data.data;
        const claimDetail: ClaimRequest = {
          key: claimData._id,
          project: apiData.find(item => item.key === id)?.project || 'Unknown', // Lấy project từ apiData
          claimname: claimData.claim_name,
          date: new Date(claimData.claim_start_date).toLocaleDateString('vi-VN', {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }),
          timeFrom: formatTime(claimData.claim_start_date),
          timeTo: formatTime(claimData.claim_end_date),
          totalHours: claimData.total_work_time ? claimData.total_work_time.toString() : '0', // Dùng total_work_time từ API GET
          status: claimData.claim_status || 'Unknown'
        };
        setSelectedClaim(claimDetail);
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching claim by ID:', error);
    }
  };

  
  const handleRowClick = (record: ClaimRequest) => {
    fetchClaimById(record.key);
  };


  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedClaim(null);
  };

  useEffect(() => {
    fetchClaims();
  }, [currentPage, pageSize, statusFilter, searchText]);

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
            value={searchText}
            style={{ width: 250 }}
            size="large"
            className="custom-search"
            allowClear
            disabled={loading}
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
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : apiData.length > 0 ? (
            apiData.map((item) => (
              <tr
                key={item.key}
                className="h-[70px] bg-white overflow-hidden text-center border-collapse hover:shadow-brand-orange !rounded-2xl cursor-pointer"
                onClick={() => handleRowClick(item)}
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
                  <span className={`${
                    item.status === 'Approved' ? 'text-green-600' :
                    item.status === 'Rejected' ? 'text-red-600' :
                    item.status === 'Draft' ? 'text-gray-600' :
                    item.status === 'Waiting' ? 'text-yellow-600' :
                    item.status === 'Canceled' ? 'text-purple-600' : 
                    'text-gray-600'
                  } font-semibold`}>
                    {item.status || 'Unknown'}
                  </span>
                </td>
                <td className="action px-4 py-2 rounded-r-2xl">
                  <div className="w-full flex justify-center gap-2 items-center space-x-2">
                    {item.status === 'Waiting' ? (
                      <Button
                        className="!bg-none !border-none"
                        onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                        disabled={loading}
                      >
                        <Trash size={24} color="red" strokeWidth={3} className="hover:bg-red-200 overflow-hidden" />
                      </Button>
                    ) : (
                      <>
                        {item.status !== 'Approved' && item.status !== 'Rejected' && item.status !== 'Canceled' && (
                          <>
                            <Button
                              className="!bg-none !border-none"
                              onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                              disabled={loading}
                            >
                              <Edit size={24} color="#FF914D" strokeWidth={3} className="hover:bg-orange-200 overflow-hidden" />
                            </Button>
                            <Button
                              className="!bg-none !border-none"
                              onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                              disabled={loading}
                            >
                              <Trash size={24} color="red" strokeWidth={3} className="hover:bg-red-200 overflow-hidden" />
                            </Button>
                            <Button
                              className="!bg-none !border-none"
                              disabled={loading}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <UserCheck size={24} color="green" strokeWidth={3} className="hover:bg-green-200 overflow-hidden" />
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onChange={onPageChange}
          showSizeChanger
          pageSizeOptions={['5', '10', '20', '50']}
          disabled={loading}
        />
      </div>

      <Modal
        title="Claim Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>
        ]}
      >
        {selectedClaim ? (
          <div>
            <p><strong>ID:</strong> {selectedClaim.key}</p>
            <p><strong>Claim Name:</strong> {selectedClaim.claimname}</p>
            <p><strong>Project:</strong> {selectedClaim.project}</p>
            <p><strong>Date:</strong> {selectedClaim.date}</p>
            <p><strong>Time From:</strong> {selectedClaim.timeFrom}</p>
            <p><strong>Time To:</strong> {selectedClaim.timeTo}</p>
            <p><strong>Total Hours:</strong> {selectedClaim.totalHours} hours</p>
            <p><strong>Status:</strong> {selectedClaim.status}</p>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </Modal>
    </div>
  );
};

export default TableRequest;