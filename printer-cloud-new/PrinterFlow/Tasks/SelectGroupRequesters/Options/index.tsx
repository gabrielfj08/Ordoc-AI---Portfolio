import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { GroupRequesterService } from '../../../../services/printer-flow';
import { SelectTaskGroupRequesterOptionsContainerProps } from './types';
import SelectTaskGroupRequesterOptions from './Options';

const SelectTaskGroupRequesterOptionsContainer = ({
  query,
  open,
  setError,
}: SelectTaskGroupRequesterOptionsContainerProps) => {
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['groupRequesters', subdomain, token, query],
    queryFn: () =>
      GroupRequesterService.index(token, subdomain, {
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
      <SelectTaskGroupRequesterOptions
        groupRequesters={data.groupRequesters}
        isError={isError}
      />
    </div>
  );
};

export default SelectTaskGroupRequesterOptionsContainer;
