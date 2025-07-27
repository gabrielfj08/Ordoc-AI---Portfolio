import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';

import Pagination from './Pagination';

describe('Pagination', () => {
  it('shows the correct objects return', () => {
    const pagination = render(
      <Pagination
        objectsPerPage={10}
        page={3}
        setPage={() => {}}
        totalObjects={37}
        totalPages={4}
      />
    );

    const { getByText } = pagination;

    expect(getByText('21-30 de 37')).toBeInTheDocument();
  });

  it('clicks the next page button', () => {
    const handleClick = jest.fn();
    const pagination = render(
      <Pagination
        objectsPerPage={10}
        page={1}
        setPage={handleClick}
        totalObjects={20}
        totalPages={2}
      />
    );

    const { getByRole } = pagination;
    const paginationButton = getByRole('button', { name: '>' });
    fireEvent.click(paginationButton);

    expect(handleClick).toBeCalledTimes(1);
  });

  it('clicks the previous page button', () => {
    const handleClick = jest.fn();
    const pagination = render(
      <Pagination
        objectsPerPage={10}
        page={2}
        setPage={handleClick}
        totalObjects={20}
        totalPages={2}
      />
    );

    const { getByRole } = pagination;
    const paginationButton = getByRole('button', { name: '<' });
    fireEvent.click(paginationButton);

    expect(handleClick).toBeCalledTimes(1);
  });
});
