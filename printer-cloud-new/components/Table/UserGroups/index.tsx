import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pagination } from 'printer-ui';
import { useAuth } from '../../../hooks';
import { UserGroupService } from '../../../services';
import { getSubdomain } from '../../../utils';
import { UserGroupsContainerProps } from './types';
import UserGroups from './UserGroups';
import UserGroupsTableSkeleton from './Skeleton';
import UserGroupsTableError from './Error';
import UserGroupsTableEmpty from './Empty';

const UserGroupsContainer = ({
  queryParams,
  page,
  setPage,
}: UserGroupsContainerProps) => {
  const { token } = useAuth();

  const { isLoading, isError, data } = useQuery(
    ['userGroups', queryParams, token],
    () => UserGroupService.index(token, getSubdomain(), queryParams)
  );

  if (isError) return <UserGroupsTableError />;

  if (isLoading) return <UserGroupsTableSkeleton />;

  const totalObjects = data?.meta.total;
  const docsPerPage = 20;

  const pageNumber =
    totalObjects > docsPerPage ? Math.ceil(totalObjects / docsPerPage) : 1;

  return (
    <div>
      {data.userGroups.length <= 0 ? (
        <UserGroupsTableEmpty />
      ) : (
        <>
          <UserGroups userGroups={data.userGroups} />
          <div className="flex justify-center p-2 space-x-2 items-center">
            <Pagination
              page={page}
              totalPages={pageNumber}
              totalDocs={totalObjects}
              docsPerPage={docsPerPage}
              setPage={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UserGroupsContainer;
