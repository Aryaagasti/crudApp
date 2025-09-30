// models/Admin.ts
export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  date_of_birth: string; // ISO format date string
  mobile_number: string;
  address: string;
}

export interface UserQueryParams {
  search: string;
  limit: number;
  sortBy: string;
  order: string;
  page?: number;
}

export interface ValidationError {
  msg: string;
  param: string;
  value: any;
  location: string;
}

export interface Admin {
  id: number;
  username: string;
  email: string;
  password: string;
  role_id?: number;
  role?: Role;
  created_at?: string;
}

export interface Permission {
  id: number;
  name: string;
  role_id: number;
}

// For encrypted JWT payload
export interface AuthPayload {
  id: number;
  username: string;
  role: string; // Matches the role name from Role
}