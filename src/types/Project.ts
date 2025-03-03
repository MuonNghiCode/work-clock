export interface Project {
  id?: string | number;
  name: string;
  code: string;
  date: string;
  enddate: string;
  status: "Processing" | "Pending" | "Complete";
  user?: string;
}
export interface ProjectInfo {
  created_at: string;
  is_deleted: boolean;
  project_code: string;
  project_department: string;
  project_description: string;
  project_end_date: string;
  project_members: any[]; // Define a more specific type if possible
  project_name: string;
  project_start_date: string;
  project_status: string;
  updated_at: string;
  updated_by: string;
  _id: string;
  // Add other properties as needed
}