import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { GroupRequesterService } from '../../../../services/printer-flow';
import { SelectGroupRequestersOptionsContainerProps } from './types';
import AddRequestersSelectError from './Error';
import SelectGroupRequestersOptions from './Options';

const SelectGroupRequestersOptionsContainer = ({
  query,
  open,
}: SelectGroupRequestersOptionsContainerProps) => {
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['groupRequesters', subdomain, token, query, {}],
    queryFn: () =>
      GroupRequesterService.index(token, subdomain, {
        q: query,
        perPage: 10,
        order: 'name',
        direction: 'asc',
        status: 'active',
      }),
  });

  if (isLoading) {
    return null;
  }

  if (isError) {
    return <AddRequestersSelectError />;
  }

  return (
    <div
      className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg ${
        open ? 'bg-white' : 'bg-transparent'
      } py-1 z-10`}
    >
      <SelectGroupRequestersOptions groupRequester={data.groupRequesters} />
    </div>
  );
};

export default SelectGroupRequestersOptionsContainer;
