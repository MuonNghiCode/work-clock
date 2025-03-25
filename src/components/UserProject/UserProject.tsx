import { useEffect, useState } from "react";
import { Pagination } from "antd";
import { getAllProject } from "../../services/projectService"; // Import the new function
import { useUser } from "../../contexts/UserContext";
import { formatDate } from "../../utils/formatDate";
import { useUser } from "../../contexts/UserContext";
import { formatDate } from "../../utils/formatDate";

interface ProjectInfo {
  key: string;
  projectName: string;
  startDate: string;
  endDate: string;
  status: string;
}

const UserProject = () => {
  const [projectsData, setProjectsData] = useState<ProjectInfo[]>([]); // Add state for projects
  const [projectsCount, setProjectsCount] = useState(0); // Add state for projects count
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Add state for current page
  const [pageSize, setPageSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { user } = useUser();

  const fetchProjects = async (pageNum: number, pageSize: number) => {
    try {
      const response = await getAllProject({
        searchCondition: {
          keyword: "",
          project_start_date: "",
          project_end_date: "",
          is_delete: false,
          user_id: user?._id || "",
          user_id: user?._id || "",
        },
        pageInfo: { pageNum, pageSize },
      });

      // Map dữ liệu từ API
      let data = response.data.pageData.map((item: any) => ({
        key: item._id,
        projectName: item.project_name,
        startDate: formatDate(new Date(item.project_start_date), "DD/MM/YYYY"),
        endDate: formatDate(new Date(item.project_end_date), "DD/MM/YYYY"),
        startDate: formatDate(new Date(item.project_start_date), "DD/MM/YYYY"),
        endDate: formatDate(new Date(item.project_end_date), "DD/MM/YYYY"),
        status: item.project_status,
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
  }, [currentPage, pageSize, statusFilter]);

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
  return (
    <div className="p-6">
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
      <div className="col-span-4 p-4 rounded-lg mt-8">
        <table className="min-w-full border-separate border-spacing-y-2.5 border-0 text-black w-full">
          <thead className="bg-brand-gradient h-[70px] text-lg text-white">
            <tr className="bg-[linear-gradient(45deg,#FEB78A,#FF914D)]">
              <th className="px-4 py-2 rounded-tl-2xl">Project Name</th>
              <th className="px-4 py-2 border-l-2 border-white">Start Date</th>
              <th className="px-4 py-2 border-l-2 border-white">End Date</th>
              <th className="px-4 py-2 border-l-2 border-white rounded-tr-2xl">
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
                  className="h-[70px] bg-white text-center hover:shadow-brand-orange rounded-2xl"
                >
                  <td className="request-table-cell px-4 py-2 rounded-l-2xl">
                    {item.projectName}
                  </td>
                  <td className="request-table-cell px-4 py-2">
                    {item.startDate}
                  </td>
                  <td className="request-table-cell px-4 py-2">
                    {item.endDate}
                  </td>
                  <td className="request-table-cell px-4 py-2 rounded-r-2xl">
                    {item.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={projectsCount}
            onChange={handlePageChange}
            showSizeChanger={false}
          // onShowSizeChange={(current, size) => setPageSize(size)}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProject;
