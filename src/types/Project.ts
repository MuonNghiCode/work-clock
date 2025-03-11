export interface Project {
  date: string;
  department: string;
  enddate: string;
  key: string;
  name: string;
  project: string;
  startdate: string;
  status: string;
  description: string;
}

export interface project_members {
  user_id: string;
  project_role: string;
  full_name?: string;
  user_name?: string;
};
export interface ProjectInfo {
  created_at?: string;
  is_deleted: boolean;
  project_code: string; //
  project_department: string;//
  project_description: string;//
  project_end_date: string;//
  project_members: project_members[];
  project_name: string;//
  project_start_date: string;//
  project_status: string;//
  updated_at?: string;
  updated_by: string;
  _id?: string;
}