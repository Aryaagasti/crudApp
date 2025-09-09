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
  page: number;
  limit: number;
  sortBy: string;
  order: string;
}

export interface ValidationError {
  msg: string;
  param: string;
  value: any;
  location: string;
}