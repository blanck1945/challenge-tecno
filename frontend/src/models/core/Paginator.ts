export interface Paginator<Result> {
  results: Result[];
  page: number;
  total: number;
  lastPage: number;
}
