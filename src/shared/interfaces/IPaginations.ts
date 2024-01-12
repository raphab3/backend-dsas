export interface IPaginationOptions {
  page: number;
  perPage: number;
}

export interface IPagination {
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

export interface IPaginatedResult<T> {
  data: T[];
  pagination: IPagination;
}
