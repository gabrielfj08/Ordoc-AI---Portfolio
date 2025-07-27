import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../../hooks';
import { RequesterService } from '../../../../../../services/printer-flow';
import { RequesterSelectOptionsContainerProps } from './types';
import SelectRequesterOptions from './Options';

const RequesterSelectOptionsContainer = ({
  query,
  open,
  setError,
}: RequesterSelectOptionsContainerProps) => {
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['requesters', subdomain, token, query, {}],
    queryFn: () =>
      RequesterService.index(token, subdomain, {
        q: query,
        perPage: 10,
        order: 'name',
        direction: 'asc',
        status: 'active',
      }),
  });

  if (isError) {
    setError(true);
    return null;
  }

  if (isLoading) return null;

  return (
    <div
      className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg py-1 ${
        open ? 'bg-white' : 'bg-transparent'
      } z-40`}
    >
      <SelectRequesterOptions requesters={data.requesters} isError={isError} />
    </div>
  );
};

export default RequesterSelectOptionsContainer;
