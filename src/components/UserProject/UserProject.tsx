import { useEffect, useState } from "react";
import { Pagination } from "antd";
import { getAllProject } from "../../services/projectService"; // Import the new function

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
  const pageSize = 5; // Set page size to 5

  const fetchProjects = async (pageNum: number, pageSize: number) => {
    try {
      const response = await getAllProject({
        searchCondition: {
          keyword: "",
          project_start_date: "",
          project_end_date: "",
          is_delete: false,
          user_id: "",
        },
        pageInfo: { pageNum, pageSize },
      });
      const data = response.data.pageData.map((item: any) => ({
        key: item._id,
        projectName: item.project_name,
        startDate: new Date(item.project_start_date).toLocaleDateString(
          "en-US"
        ),
        endDate: new Date(item.project_end_date).toLocaleDateString("en-US"),
        status: item.project_status,
      }));
      setProjectsData(data);
      setProjectsCount(response.data.pageInfo.totalItems || 0); // Assuming the API returns total count
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(currentPage, pageSize); // Fetch projects data
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    setLoading(true);
    fetchProjects(page, pageSize || 5);
  };

  return (
    <div>
      <div className="col-span-4 p-4 rounded-lg mt-8">
        <h3 className="text-lg font-bold">Project List</h3>
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
