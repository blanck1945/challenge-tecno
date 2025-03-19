export interface Pagination<Result> {
  results: Result[];
  page: number;
  total: number;
  lastPage: number;
}
