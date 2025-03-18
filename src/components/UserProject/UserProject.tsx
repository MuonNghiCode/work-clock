import { useEffect, useState } from "react";
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
  const [ProjectsCount, setProjectsCount] = useState(0); // Add state for projects count
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const response = await getAllProject({
        searchCondition: {
          keyword: "",
          project_start_date: "",
          project_end_date: "",
          is_delete: false,
          user_id: "",
        },
        pageInfo: { pageNum: 1, pageSize: 30 },
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
      setProjectsCount(data.length);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(); // Fetch projects data
  }, []);
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
              {/* <th className="px-4 py-2 border-l-2 border-white rounded-tr-2xl">
          Action
        </th> */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : projectsData.length > 0 ? (
              projectsData
                .sort(
                  (a, b) =>
                    new Date(b.startDate).getTime() -
                    new Date(a.startDate).getTime()
                )
                .slice(0, 3)
                .map((item) => (
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
                    {/* <td className="request-table-cell px-4 py-2 rounded-r-2xl">
                <div className="request-table-actions flex justify-center gap-2">
                  <Button
                    className="!border-none"
                    onClick={() => navigate("/user/project-details")}
                    title="View Details"
                  >
                    <CalendarIcon size={18} color="#FF914D" />
                  </Button>
                </div>
              </td> */}
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserProject;
