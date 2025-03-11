import { ApprovalInfo } from "./Approval";
import { EmployeeInfo } from "./Employee";
import { ProjectInfo } from "./Project";

export interface ClaimRequest {
  _id: string;
  claim_name: string;
  claim_status: string;
  claim_start_date: string;
  claim_end_date: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  approval_info: ApprovalInfo;
  employee_info: EmployeeInfo;
  project_info: ProjectInfo;
  role_in_project: string | null;
  staff_email: string;
  staff_id: string;
  staff_name: string;
  staff_role: string | null;
  remark?: string;
  totalNoOfHours?: number;
}
