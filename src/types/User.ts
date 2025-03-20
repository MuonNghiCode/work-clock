export interface User {
  _id: string;
  email: string;
  user_name: string;
  role_code: string;
  is_verified: boolean;
  verification_token: string;
  verification_token_expires: string;
  token_version: number;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  __v: number;
}