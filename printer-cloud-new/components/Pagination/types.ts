export interface PaginationProps {
  objectsPerPage: number;
  page: number;
  setPage: (page: number) => void;
  totalObjects: number;
  totalPages: number;
}
