
export interface EmployeeInfo {
    account: string;
    address: string;
    avatar_url: string;
    contract_type: string;
    created_at?: string | Date;
    department_name: string;
    end_date: string | null;
    full_name: string;
    is_deleted: boolean;
    job_rank: string;
    phone: string;
    salary: number;
    start_date: string;
    updated_at?: string | Date;
    updated_by: string;
    user_id: string;
    department_code: string;
}
export interface JobRank {
    id: string;
    job_rank: string;
    job_title: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    __v: number;
}