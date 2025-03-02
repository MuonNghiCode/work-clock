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
}
export const generateFakeData = (): ClaimRequest[] => {
  const projects = ["Project A", "Project B", "Project C"];
  const statuses: ClaimRequest["claim_status"][] = [
    "Draft", "Pending", "Approval", "Approved", "Paid", "Rejected", "Canceled"
  ];
  const fakeData: ClaimRequest[] = [];

  for (let i = 0; i < 1000; i++) {
    fakeData.push({
      _id: `claim${i + 1}`,
      claim_name: `Request OT${i + 1}`,
      claim_status: statuses[i % statuses.length],
      claim_start_date: new Date(`2025-02-${String((i % 28) + 1).padStart(2, "0")}T10:48:36.083Z`).toISOString(),
      claim_end_date: new Date(`2025-02-${String((i % 28) + 1).padStart(2, "0")}T14:48:36.083Z`).toISOString(),
      created_at: new Date(`2025-02-${String((i % 28) + 1).padStart(2, "0")}T09:27:32.238Z`).toISOString(),
      updated_at: new Date(`2025-02-${String((i % 28) + 1).padStart(2, "0")}T09:41:16.297Z`).toISOString(),
      is_deleted: false,
      approval_info: {
        _id: `approval${i + 1}`,
        email: `approval${i + 1}@example.com`,
        user_name: `approval group${i + 1}`,
        role_code: `A00${i + 1}`,
        is_verified: true,
      },
      employee_info: {
        account: `account${i + 1}`,
        address: `address${i + 1}`,
        avatar_url: `avatar${i + 1}.png`,
        contract_type: `contract${i + 1}`,
        created_at: new Date(`2025-02-${String((i % 28) + 1).padStart(2, "0")}T01:38:52.119Z`).toISOString(),
        department_name: `department${i + 1}`,
        end_date: null,
        full_name: `full name${i + 1}`,
        is_deleted: false,
        job_rank: `rank${i + 1}`,
        phone: `phone${i + 1}`,
        salary: i * 1000,
        start_date: new Date(`2025-02-${String((i % 28) + 1).padStart(2, "0")}T01:38:52.119Z`).toISOString(),
        updated_at: new Date(`2025-02-${String((i % 28) + 1).padStart(2, "0")}T01:38:52.119Z`).toISOString(),
        updated_by: `user${i + 1}`,
        user_id: `user${i + 1}`,
        _id: `employee${i + 1}`,
      },
      project_info: {
        created_at: new Date(`2025-02-${String((i % 28) + 1).padStart(2, "0")}T02:59:25.883Z`).toISOString(),
        is_deleted: false,
        project_code: `code${i + 1}`,
        project_department: `department${i + 1}`,
        project_description: `description${i + 1}`,
        project_end_date: new Date(`2025-02-${String((i % 28) + 1).padStart(2, "0")}T07:47:06.175Z`).toISOString(),
        project_members: [],
        project_name: projects[i % projects.length],
        project_start_date: new Date(`2025-02-${String((i % 28) + 1).padStart(2, "0")}T07:47:06.175Z`).toISOString(),
        project_status: `status${i + 1}`,
        updated_at: new Date(`2025-02-${String((i % 28) + 1).padStart(2, "0")}T02:59:25.883Z`).toISOString(),
        updated_by: `user${i + 1}`,
        _id: `project${i + 1}`,
      },
      role_in_project: `role${i + 1}`,
      staff_email: `staff${i + 1}@example.com`,
      staff_id: `staff${i + 1}`,
      staff_name: `Staff ${i + 1}`,
      staff_role: `Role ${i + 1}`,
    });
  }

  return fakeData;
};
