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
  documentId,
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
    isLoading: sharedObjectDocumentIsloading,
    isError: sharedObjectDocumentIsError,
    data: sharedObjectDocumentIsData,
  } = useQuery({
    queryKey: ['sharedDocumentsUser', documentId, token, subdomain],
    queryFn: () =>
      SharedObjectService.indexDocuments(
        token,
        subdomain,
        session.organization.id,
        documentId
      ),
  });

  if (userIsLoading || sharedObjectDocumentIsloading) return null;

  if (userIsError || sharedObjectDocumentIsError)
    return (
      <div className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg bg-white py-1 z-10">
        <UserSelectOptionsError />
      </div>
    );

  const sharedObjectDocumentIds =
    sharedObjectDocumentIsData.sharedDocuments.map(
      (sharedDocument) => sharedDocument.user.id
    );

  const addUsers = userData.users.filter(
    (user) =>
      user.id !== session.user.id && !sharedObjectDocumentIds.includes(user.id)
  );

  return (
    <div className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg bg-white py-1 z-10">
      <UserSelectOptions users={addUsers} />
    </div>
  );
};

export default UserSelectOptionsContainer;
