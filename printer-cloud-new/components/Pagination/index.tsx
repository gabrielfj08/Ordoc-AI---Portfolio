import * as React from 'react';
import Pagination from './Pagination';
import { PaginationProps } from './types';

const PaginationContainer = ({
  objectsPerPage,
  page,
  setPage,
  totalObjects,
  totalPages,
}) => {
  return (
    <Pagination
      objectsPerPage={objectsPerPage}
      page={page}
      setPage={setPage}
      totalObjects={totalObjects}
      totalPages={totalPages}
    />
  );
};

export default PaginationContainer;
