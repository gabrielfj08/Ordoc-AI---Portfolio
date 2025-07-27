import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useSession } from '../../../../hooks';
import { UserService } from '../../../../services';
import { UserSelectOptionsContainerProps } from './types';
import UserSelectOptionsError from './Error';
import UserSelectOptions from './Options';

const UserSelectOptionsContainer = ({
  query,
}: UserSelectOptionsContainerProps) => {
  const { subdomain, token } = useAuth();
  const { session } = useSession();

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      'organizations',
      session.organization.id,
      'users',
      { token, query },
    ],
    queryFn: () =>
      UserService.index(token, subdomain, {
        q: query,
        perPage: 10,
        order: 'username',
        direction: 'asc',
      }),
  });

  if (isLoading) return null;

  if (isError)
    return (
      <div className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg bg-white py-1 z-10">
        <UserSelectOptionsError />
      </div>
    );

  return (
    <div className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg bg-white py-1 z-10">
      <UserSelectOptions users={data.users} />
    </div>
  );
};

export default UserSelectOptionsContainer;
