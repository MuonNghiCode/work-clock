import { useEffect, useState } from "react";
import { Pagination, Modal } from "antd"; // Import Modal from antd
import { getAllProject } from "../../services/projectService"; // Import the new function
import { formatDate } from "../../utils/formatDate";
import { BookOpen, Calendar, CheckCircle, User, X } from "lucide-react";
import { useUser } from "../../contexts/UserContext";

interface ProjectInfo {
  key: string;
  projectName: string;
  start_date: string;
  end_date: string;
  status: string;
  project_description: string;
}

const UserProject = () => {
  const [projectsData, setProjectsData] = useState<ProjectInfo[]>([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { user } = useUser();
  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchProjects = async (pageNum: number, pageSize: number) => {
    try {
      const response = await getAllProject({
        searchCondition: {
          keyword: "",
          project_start_date: "",
          project_end_date: "",
          is_delete: false,
          user_id: user?._id || "",
        },
        pageInfo: { pageNum, pageSize },
      }, true);

      // Map dữ liệu từ API
      let data = response.data.pageData.map((item: any) => ({
        key: item._id,
        projectName: item.project_name,
        start_date: formatDate(new Date(item.project_start_date), "DD/MM/YYYY"),
        end_date: formatDate(new Date(item.project_end_date), "DD/MM/YYYY"),
        status: item.project_status,
        project_description: item.project_description,
      }));

      // Lọc dữ liệu theo statusFilter
      if (statusFilter !== "all") {
        data = data.filter((item) => item.status === statusFilter);
      }

      setProjectsData(data);

      // Cập nhật tổng số lượng dự án (sau khi lọc)
      setProjectsCount(data.length);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(currentPage, pageSize); // Fetch projects data
  }, [currentPage, pageSize, statusFilter, selectedProject]);

  const handlePageChange = (page: number, newPageSize?: number) => {
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleProjectClick = (project: ProjectInfo) => {
    setSelectedProject(project);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedProject(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="px-3 py-1 border rounded-lg font-squada text-lg"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="New">New</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>
      <div className="request-header mb-4">
        <table className="request-table min-w-full border-separate border-spacing-y-2.5">
          <thead className="request-table-header bg-gradient-to-r from-[#FEB78A] to-[#FF914D] h-[70px] text-lg text-white rounded-t-lg">
            <tr>
              <th className="request-table-header-cell px-4 py-2 rounded-tl-2xl">Project Name</th>
              <th className="request-table-header-cell px-4 py-2 border-l-2 border-white">Start Date</th>
              <th className="request-table-header-cell px-4 py-2 border-l-2 border-white">End Date</th>
              <th className="request-table-header-cell px-4 py-2 border-l-2 border-white rounded-tr-2xl">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : projectsData.length > 0 ? (
              projectsData.map((item) => (
                <tr
                  key={item.key}
                  className="request-table-row h-[70px] bg-white text-center hover:shadow-brand-orange rounded-2xl cursor-pointer"
                  onClick={() => handleProjectClick(item)} // Gọi hàm khi bấm vào project
                >
                  <td className="request-table-cell px-4 py-2 rounded-l-2xl">
                    {item.projectName}
                  </td>
                  <td className="request-table-cell px-4 py-2">{item.start_date}</td>
                  <td className="request-table-cell px-4 py-2">{item.end_date}</td>
                  <td className="request-table-cell px-4 py-2 rounded-r-2xl">
                    {item.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="request-table-no-data text-center py-4">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          {projectsCount > 0 && (
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={projectsCount}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          )}
        </div>
      </div>

      {/* Modal hiển thị thông tin chi tiết */}
      <Modal
        visible={isModalVisible}
        onCancel={handleCloseModal}
        className="request-modal"
        footer={null}
        closeIcon={null}
        loading={loading}
      >
        {selectedProject && (
          <div className="p-8 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-[#FF9447]">
                Project Details
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="gap-10">
              <div className="">
                <div className="bg-white rounded-lg p-6 shadow-sm h-full">
                  <h4 className="text-lg font-bold text-[#FF9447] mb-4 border-b pb-2">
                    Project Information
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User
                        size={18}
                        className="text-[#FF9447] mr-3 flex-shrink-0"
                      />
                      <span className="w-1/3 font-medium text-gray-600">
                        Project Name:
                      </span>
                      <span className="w-2/3 text-gray-800 font-semibold truncate">
                        {selectedProject.projectName}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar
                        size={18}
                        className="text-[#FF9447] mr-3 flex-shrink-0"
                      />
                      <span className="w-1/3 font-medium text-gray-600">
                        Start Date:
                      </span>
                      <span className="w-2/3 text-gray-800 font-semibold">
                        {selectedProject.start_date}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar
                        size={18}
                        className="text-[#FF9447] mr-3 flex-shrink-0"
                      />
                      <span className="w-1/3 font-medium text-gray-600">
                        End Date:
                      </span>
                      <span className="w-2/3 text-gray-800 font-semibold">
                        {selectedProject.end_date}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen
                        size={18}
                        className="text-[#FF9447] mr-3 flex-shrink-0"
                      />
                      <span className="w-1/3 font-medium text-gray-600">
                        Project Description:
                      </span>
                      <span className="w-2/3 text-gray-800 font-semibold">
                        {selectedProject.project_description}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle
                        size={18}
                        className="text-[#FF9447] mr-3 flex-shrink-0"
                      />
                      <span className="w-1/3 font-medium text-gray-600">
                        Status:
                      </span>
                      <span className="w-2/3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedProject.status === "New"
                            ? "bg-green-50 text-green-600"
                            : selectedProject.status === "Closed"
                              ? "bg-red-50 text-red-600"
                              : selectedProject.status === "Pending"
                                ? "bg-yellow-50 text-yellow-600"
                                : selectedProject.status === "Active"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-gray-50 text-gray-600"
                            }`}
                        >
                          {selectedProject.status}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserProject;
