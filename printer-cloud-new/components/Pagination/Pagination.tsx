import * as React from 'react';
import { PaginationProps } from './types';
import { Typography } from 'printer-ui';

const Pagination = ({
  page,
  setPage,
  totalObjects,
  totalPages,
  objectsPerPage,
}: PaginationProps) => {
  const buttonClassName =
    'h-7 w-7 bg-info rounded-full flex items-center justify-center text-white hover:bg-info/50 disabled:bg-lightGray';

  if (!totalObjects) {
    return (
      <div className="flex items-center space-x-3">
        <Typography variant="footnote1">0 de 0</Typography>
        <div className="flex space-x-3 items-center">
          <button disabled className={buttonClassName}>
            &lt;
          </button>
          <button disabled className={buttonClassName}>
            &gt;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <Typography variant="footnote1">
        {objectsPerPage * (page - 1) + 1}-
        {page === totalPages
          ? totalObjects
          : objectsPerPage * (page - 1) + objectsPerPage}
        {' de '}
        {totalObjects}
      </Typography>
      <div className="flex space-x-3 items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage(page > 1 ? page - 1 : page)}
          className={buttonClassName}
        >
          &lt;
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className={buttonClassName}
          name="next"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
