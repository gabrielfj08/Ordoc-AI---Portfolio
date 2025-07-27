import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useSession } from '../../../../../../../../hooks';
import { UserService } from '../../../../../../../../services';
import { SharedObjectService } from '../../../../../../../../services/printer-air';
import { UserSelectOptionsContainerProps } from './types';
import UserSelectOptionsError from './Error';
import UserSelectOptions from './Options';

const UserSelectOptionsContainer = ({
  query,
  directoryId,
}: UserSelectOptionsContainerProps) => {
  const { subdomain, token } = useAuth();
  const { session } = useSession();

  const {
    isLoading: userIsLoading,
    isError: userIsError,
    data: userData,
  } = useQuery({
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

  const {
    isLoading: sharedObjectDirectoriesIsloading,
    isError: sharedObjectDirectoriesIsError,
    data: sharedObjectDirectoriesIsData,
  } = useQuery({
    queryKey: ['directories', directoryId, 'sharedObjects', { token }],
    queryFn: () =>
      SharedObjectService.indexDirectories(
        token,
        subdomain,
        session.organization.id,
        directoryId
      ),
  });

  if (userIsLoading || sharedObjectDirectoriesIsloading) return null;

  if (userIsError || sharedObjectDirectoriesIsError)
    return (
      <div className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg bg-white py-1 z-10">
        <UserSelectOptionsError />
      </div>
    );

  const sharedObjectDirectoriesIds =
    sharedObjectDirectoriesIsData.sharedDirectories.map(
      (sharedDirectory) => sharedDirectory.user.id
    );

  const addUsers = userData.users.filter(
    (user) =>
      user.id !== session.user.id &&
      !sharedObjectDirectoriesIds.includes(user.id)
  );

  return (
    <div className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg bg-white py-1 z-10">
      <UserSelectOptions users={addUsers} />
    </div>
  );
};

export default UserSelectOptionsContainer;
