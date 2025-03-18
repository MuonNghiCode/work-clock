import React from "react";
import TableProject from "../../../components/AdminComponents/TableProject/TableProject";

const AdminProject: React.FC = () => {
  // const fetchProjects = async () => {
  //   setLoading(true); // Start loading
  //   try {
  //     const searchCondition: SearchCondition = {
  //       keyword: searchValue, // Include search keyword
  //       project_start_date: "",
  //       project_end_date: "",
  //       is_delete: false,
  //       user_id: "",
  //     };

  //     const pageInfo: PageInfo = {
  //       pageNum: currentPage,
  //       pageSize: pageSize,
  //       totalItems: 0,
  //       totalPages: 0,
  //     };

  //     const response = await getAllProject(searchCondition, pageInfo);
  //     if (response.success) {
  //       const formattedProjects: Project[] = response.data.pageData.map((item: ProjectItem) => ({
  //         key: item._id, // Assuming _id is the unique identifier
  //         name: item.project_name,
  //         date: item.project_start_date,
  //         enddate: item.project_end_date,
  //         department: item.project_department,
  //         status: item.project_status || 'New',
  //         project: item.project_name,
  //         startdate: item.project_start_date,
  //       }));
  //       setProjects(formattedProjects);
  //       setTotalItems(response.data.pageInfo.totalItems);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching projects:", error);
  //   } finally {
  //     setLoading(false); // End loading
  //   }
  // };

  // useEffect(() => {
  //   fetchProjects();
  // }, [currentPage, pageSize, searchValue]); // Add searchValue to dependencies

  // const handleEditProject = (editedProject: Project) => {
  //   const newProjects = projects.map(project =>
  //     project.key === editedProject.key ? editedProject : project
  //   );
  //   setProjects(newProjects);
  // };

  // const handleDeleteProject = (projectId: string | number) => {
  //   console.log("Deleting project with id:", projectId);
  //   // Sử dụng callback để đảm bảo có state mới nhất
  //   setProjects(prevProjects => {
  //     console.log("Previous projects:", prevProjects);
  //     const newProjects = prevProjects.filter(project => project.key !== projectId);
  //     console.log("New projects:", newProjects);
  //     return newProjects;
  //   });
  // };

  return (
    <>
      <div className="p-6 w-full rounded-lg">
        <div className="w-full flex-col">
          <TableProject
          // data={projects}
          // totalItems={totalItems}
          // loading={loading}
          // onEditProject={handleEditProject}
          // onDeleteProject={handleDeleteProject}
          // searchValue={searchValue} // Pass searchValue to TableProject
          // setSearchValue={setSearchValue} // Pass setSearchValue to TableProject
          />
        </div>
      </div>
    </>
  );
};

export default AdminProject;
