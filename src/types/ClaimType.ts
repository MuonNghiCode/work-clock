export interface ClaimItem {
  _id: string;
  project_info: {
    project_name: string;
  };
  claim_name: string;
  claim_start_date: string;
  claim_end_date: string;
  total_work_time?: number;
  claim_status: string;
}

