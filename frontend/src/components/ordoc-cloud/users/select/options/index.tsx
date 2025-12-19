import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserSelectOptionsContainerProps } from './types';
import UserSelectOptionsError from './Error';
import UserSelectOptions from './Options';
import { usersService } from '../../../../../services/users';

const UserSelectOptionsContainer = ({
  query,
}: UserSelectOptionsContainerProps) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () =>
      usersService.getUsers({
        q: query,
        per_page: 10,
        order: 'name',
        direction: 'asc',
      }),
    enabled: query.length > 0,
  });

  if (isLoading) return null;

  if (isError)
    return (
      <div className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg bg-white py-1 z-10 ring-1 ring-black ring-opacity-5">
        <UserSelectOptionsError />
      </div>
    );

  return (
    <div className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg bg-white py-1 z-10 ring-1 ring-black ring-opacity-5">
      <UserSelectOptions users={data?.users || []} />
    </div>
  );
};

export default UserSelectOptionsContainer;
