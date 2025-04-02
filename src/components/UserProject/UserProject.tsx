import { useEffect, useState, useCallback } from "react";
import { Pagination, Modal } from "antd"; // Import Modal from antd
import { getAllProject } from "../../services/projectService"; // Import the new function
import { formatDate } from "../../utils/formatDate";
import { BookOpen, Calendar, CheckCircle, Search, User, X } from "lucide-react";
import { motion } from "framer-motion";
import debounce from "lodash.debounce"; // Import debounce from lodash
import { useUserStore } from "../../config/zustand";

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
  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState<string>("");

  const userId = useUserStore((state) => state.user?.id);

  const fetchProjects = async (pageNum: number, pageSize: number) => {
    try {
      const response = await getAllProject({
        searchCondition: {
          keyword: searchText,
          project_start_date: "",
          project_end_date: "",
          is_delete: false,
          user_id: userId || "",
        },
        pageInfo: { pageNum, pageSize },
      });

      let data = response.data.pageData.map((item: any) => ({
        key: item._id,
        projectName: item.project_name,
        start_date: formatDate(new Date(item.project_start_date), "DD/MM/YYYY"),
        end_date: formatDate(new Date(item.project_end_date), "DD/MM/YYYY"),
        status: item.project_status,
        project_description: item.project_description,
      }));

      if (statusFilter !== "all") {
        data = data.filter((item) => item.status === statusFilter);
      }

      setProjectsData(data);
      setProjectsCount(data.length);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(currentPage, pageSize);
  }, [currentPage, pageSize, selectedProject, statusFilter, searchText]);

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

  const handleStatusChangeHTML = (status: string) => {
    switch (status) {
      case "Active":
        return <span className="text-[#00B087]">Active</span>;
      case "Pending":
        return <span className="text-[#FFBF00]">Pending</span>;
      case "Closed":
        return <span className="text-[#FF0420]">Closed</span>;
      default:
        return <span className="text-gray-600">{status}</span>;
    }
  };

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearchText(value);
      setCurrentPage(1);
    }, 1000),
    []
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="px-3 py-1 text-lg border rounded-lg font-squada"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="New">New</option>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
        </select>
        <div className="relative w-[300px]">
          <input
            type="text"
            placeholder="Search project name"
            className="w-full px-4 py-2 border rounded-full pr-10 font-squada"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Search
            className="absolute right-3 top-2.5 text-gray-400"
            size={20}
          />
        </div>

      </div>
      <motion.div
        className="mb-4 request-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <motion.table
          className="request-table min-w-full border-separate border-spacing-y-2.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}>
          <thead className="request-table-header bg-gradient-to-r from-[#FEB78A] to-[#FF914D] h-[70px] text-lg text-white rounded-t-lg">
            <tr>
              <th className="px-4 py-2 request-table-header-cell rounded-tl-2xl">Project Name</th>
              <th className="px-4 py-2 border-l-2 border-white request-table-header-cell">Start Date</th>
              <th className="px-4 py-2 border-l-2 border-white request-table-header-cell">End Date</th>
              <th className="px-4 py-2 border-l-2 border-white request-table-header-cell rounded-tr-2xl">
                Status
              </th>
            </tr>
          </thead>
          <motion.tbody
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : projectsData.length > 0 ? (
              projectsData.map((item) => (
                <motion.tr
                  key={item.key}
                  className="request-table-row h-[70px] bg-white text-center hover:shadow-brand-orange rounded-2xl cursor-pointer"
                  onClick={() => handleProjectClick(item)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-4 py-2 request-table-cell rounded-l-2xl">
                    {item.projectName}
                  </td>
                  <td className="px-4 py-2 request-table-cell">{item.start_date}</td>
                  <td className="px-4 py-2 request-table-cell">{item.end_date}</td>
                  <td className="px-4 py-2 request-table-cell rounded-r-2xl">
                    {handleStatusChangeHTML(item.status)}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-4 text-center request-table-no-data">
                  No Data Available
                </td>
              </tr>
            )}
          </motion.tbody>
        </motion.table>
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
      </motion.div>

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
            <div className="flex items-center justify-between mb-6">
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
                <div className="h-full p-6 bg-white rounded-lg shadow-sm">
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
                      <span className="w-2/3 font-semibold text-gray-800 truncate">
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
                      <span className="w-2/3 font-semibold text-gray-800">
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
                      <span className="w-2/3 font-semibold text-gray-800">
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
                      <span className="w-2/3 font-semibold text-gray-800">
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
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedProject.status === "Closed"
                            ? "bg-[#fbd0d5] text-[#FF0420]"
                            : selectedProject.status === "Pending"
                              ? "bg-[#fef7e3] text-[#FFBF00]"
                              : selectedProject.status === "Active"
                                ? "bg-[#e6fff9] text-[#00B087]"
                                : "bg-gray-100 text-gray-600"
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
