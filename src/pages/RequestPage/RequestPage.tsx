import React from 'react';
import { Input, Form, Button, Pagination, Tag } from 'antd';
import { Trash, Edit, UserCheck } from 'lucide-react';
import { useState } from 'react';
import './RequestPage.css';
import { CheckOutlined } from "@ant-design/icons";
import EditRequestModal from '../../components/EditRequestModal/EditRequestModal';
import DeleteRequestModal from '../../components/DeleteRequestModal/DeleteRequestModal';

const { Search } = Input;

interface ClaimRequest {
  key: string;
  project: string;
  date: string;
  totalHours: string;
  timeFrom: string;
  timeTo: string;
  status: string;
}

const calculateHours = (timeFrom: string, timeTo: string): number => {
  const convertTime = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours + minutes / 60;
  };

  const fromHours = convertTime(timeFrom);
  const toHours = convertTime(timeTo);
  
  return Math.round(toHours - fromHours);
};

const data: ClaimRequest[] = [
  {
    key: '1',
    project: 'Anaconda address',
    date: '10/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Approved',
  },
  {
    key: '2',
    project: 'Anaconda address',
    date: '10/02/2025',
    timeFrom: '2:00 PM',
    timeTo: '5:00 PM',
    totalHours: calculateHours('2:00 PM', '5:00 PM').toString(),
    status: 'Waiting',
  },
  {
    key: '3',
    project: 'Python Project',
    date: '11/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Approved',
  },
  {
    key: '4',
    project: 'React Development',
    date: '12/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Waiting',
  },
  {
    key: '5',
    project: 'Mobile App',
    date: '13/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Approved',
  },
  {
    key: '6',
    project: 'Database Migration',
    date: '14/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Waiting',
  },
  {
    key: '7',
    project: 'Cloud Infrastructure',
    date: '15/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Approved',
  },
  {
    key: '8',
    project: 'Security Audit',
    date: '16/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Waiting',
  },
  {
    key: '9',
    project: 'UI/UX Design',
    date: '17/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Approved',
  },
  {
    key: '10',
    project: 'API Integration',
    date: '18/02/2025',
    timeFrom: '6:00 PM',
    timeTo: '10:00 PM',
    totalHours: calculateHours('6:00 PM', '10:00 PM').toString(),
    status: 'Waiting',
  }
];

const RequestPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [tableData, setTableData] = useState(data);
  const [form] = Form.useForm();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<ClaimRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');

  const handleStatusChange = (status: string) => {
    setStatusFilter(status === "All" ? null : status);
    setCurrentPage(1);
  };

  const statusTags = ["All", "Waiting", "Approved", "Rejected"];

  const filteredData = tableData.filter((item) => {
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    const matchesSearch = item.project.toLowerCase().includes(searchText.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsEditModalOpen(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalOpen(false);
    form.resetFields();
  };

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      const totalHours = calculateHours(values.timeFrom, values.timeTo).toString();
      
      setTableData(prevData => 
        prevData.map(item => 
          item.key === editingRecord.key 
            ? { ...item, ...values, totalHours } 
            : item
        )
      );
      setIsEditModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleDelete = (record: ClaimRequest) => {
    setDeletingRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalOk = () => {
    if (deletingRecord) {
      setTableData(prevData => prevData.filter(item => item.key !== deletingRecord.key));
      setIsDeleteModalOpen(false);
      setDeletingRecord(null);
    }
  };

  const handleDeleteModalCancel = () => {
    setIsDeleteModalOpen(false);
    setDeletingRecord(null);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          {statusTags.map((status) => (
            <Tag
              key={status}
              color={statusFilter === status ? "blue" : "default"}
              onClick={() => handleStatusChange(status)}
              className="cursor-pointer !px-3 !py-1 !font-squada !text-lg !rounded-lg"
            >
              {statusFilter === status && <CheckOutlined />} {status}
            </Tag>
          ))}
        </div>
        <div className="w-[250px] height-[48px] overflow-hidden rounded-full border-[1px] border-gray-300 bg-white">
      <Search 
            placeholder="Search project name"
            style={{ width: 250 }}
            size="large"
            className="custom-search"
            variant="borderless"
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <table className="min-w-full !border-separate border-spacing-y-2.5 border-gray-300 text-black border-0">
        <thead className="bg-brand-grandient h-[100px] text-2xl">
          <tr className="bg-gradient from-[FEB78A] to-[FF914D]">
            <th className="border-white px-4 py-2">Project</th>
            <th className="border-l-2 border-white px-4 py-2">Date</th>
            <th className="border-l-2 border-white px-4 py-2">Total Hours</th>
            <th className="border-l-2 border-white px-4 py-2">Status</th>
            <th className="border-l-2 border-white px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody className="w-full text-[20px]">
          {filteredData.map((item, index) => (
            <tr
              key={index}
              className="h-[100px] bg-white border-black !border-2 !rounded-lg text-center border-collapse shadow-lg hover:shadow-2xl"
            >
              <td className="px-4 py-2 border-l-2 border-t-2 border-b-2 rounded-l-lg">
                {item.project}
              </td>
              <td className="px-4 py-2 border-t-2 border-b-2">{item.date}</td>
              <td className="px-4 py-2 border-t-2 border-b-2">
                <div className="flex flex-col items-center">
                  <span className="text-gray-700">{`(${item.timeFrom}-${item.timeTo})`}</span>
                  <span className="font-semibold text-[#FF914D]">{item.totalHours} hours</span>
                </div>
              </td>
              <td className="px-4 py-2 border-t-2 border-b-2">
                <span className={`${item.status === 'Approved' ? 'text-green-600' : 'text-yellow-600'} font-semibold`}>
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-2 border-r-2 border-t-2 border-b-2 rounded-r-lg">
                <div className="w-full flex justify-center items-center space-x-6">
                  <div className="flex justify-center items-center w-12 h-12 overflow-hidden rounded-full">
                    <Button className="!bg-none !border-none" onClick={() => handleEdit(item)}>
                      <Edit size={48} color="#FF914D" strokeWidth={3} className="hover:bg-orange-200 overflow-hidden rounded-full" />
                    </Button>
                  </div>
                  <div className="flex justify-center items-center w-12 h-12 overflow-hidden rounded-full">
                    <Button className="!bg-none !border-none" onClick={() => handleDelete(item)}>
                      <Trash size={48} color="red" strokeWidth={3} className="hover:bg-red-200 overflow-hidden rounded-full" />
                    </Button>
                  </div>
                  <div className="flex justify-center items-center w-12 h-12 overflow-hidden rounded-full">
                    <Button className="!bg-none !border-none">
                      <UserCheck size={48} color="green" strokeWidth={3} className="hover:bg-green-200 overflow-hidden rounded-full" />
                    </Button>
                  </div>
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
          onChange={(page, size) => {
            setCurrentPage(page);
            if (size) setPageSize(size);
          }}
          showSizeChanger
        />
      </div>

      <EditRequestModal
        isOpen={isEditModalOpen}
        onCancel={handleEditModalCancel}
        onOk={handleEditModalOk}
        form={form}
        editingRecord={editingRecord}
      />

      <DeleteRequestModal
        isOpen={isDeleteModalOpen}
        onOk={handleDeleteModalOk}
        onCancel={handleDeleteModalCancel}
      />
    </div>
  );
};

export default RequestPage;