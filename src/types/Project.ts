export interface Project {
  name: string;
  code: string;
  date: string;
  status: 'Processing' | 'Pending' | 'Complete';
} 