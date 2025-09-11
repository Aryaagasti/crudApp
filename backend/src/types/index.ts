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
  page?:number;
}

export interface ValidationError {
  msg: string;
  param: string;
  value: any;
  location: string;
}