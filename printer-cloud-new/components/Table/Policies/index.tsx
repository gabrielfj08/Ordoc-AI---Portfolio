import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pagination } from 'printer-ui';
import { useAuth } from '../../../hooks';
import { PolicyService } from '../../../services';
import { PoliciesContainerProps } from './types';
import PoliciesTableSkeleton from './Skeleton';
import PoliciesTableError from './Error';
import PoliciesTableEmpty from './Empty';
import Policies from './Policies';

const PoliciesContainer = ({
  setPage,
  filterParams,
}: PoliciesContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ['policies', filterParams, token],
    queryFn: () => PolicyService.index(token, subdomain, filterParams),
  });

  if (isLoading && isFetching) return <PoliciesTableSkeleton />;

  if (isError) return <PoliciesTableError />;

  const totalObjects = data.meta.total;
  const docsPerPage = 20;

  const pageNumber =
    totalObjects > docsPerPage ? Math.ceil(totalObjects / docsPerPage) : 1;

  return (
    <div>
      {data.policies.length <= 0 ? (
        <PoliciesTableEmpty />
      ) : (
        <>
          <Policies policies={data.policies} />
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

export default PoliciesContainer;
