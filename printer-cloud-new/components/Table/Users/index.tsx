import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { Pagination } from 'printer-ui';
import { UsersContainerProps } from './types';
import { UserService } from '../../../services';
import UsersTableSkeleton from './Skeleton';
import UsersTableError from './Error';
import UsersTableEmpty from './Empty';
import Users from './Users';

const UsersContainer = ({ filterParams, setPage }: UsersContainerProps) => {
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data, isFetching } = useQuery(
    ['users', filterParams, token],
    () => UserService.index(token, subdomain, filterParams)
  );

  if (isLoading && isFetching) return <UsersTableSkeleton />;

  if (isError || !data) return <UsersTableError />;

  const totalObjects = data.meta.total;
  const docsPerPage = 20;

  const pageNumber =
    totalObjects > docsPerPage ? Math.ceil(totalObjects / docsPerPage) : 1;

  return (
    <div>
      {data.users.length <= 0 ? (
        <UsersTableEmpty />
      ) : (
        <>
          <Users users={data.users} />
          <div className="flex justify-center p-2 space-x-2 items-center">
            <Pagination
              page={filterParams.page}
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

export default UsersContainer;
