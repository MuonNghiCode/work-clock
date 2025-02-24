export interface Project {
  id?: string | number;
  name: string;
  code: string;
  date: string;
  status: "Processing" | "Pending" | "Complete";
} 