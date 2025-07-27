import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { useAuth } from '../../../../hooks';
import { GroupRequesterService } from '../../../../services/printer-flow/GroupRequester';
import { GroupRequestersTableContainerProps } from './types';
import IndexGroupRequestersError from './Error';
import IndexGroupRequestersSkeleton from './Skeleton';
import IndexGroupRequestersEmpty from './Empty';
import GroupsTable from './Table';

const GroupRequestersTableContainer = ({
  params,
  setTotalObjects,
}: GroupRequestersTableContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ['groupRequesters', subdomain, token, { params }],
    queryFn: () => GroupRequesterService.index(token, subdomain, params),
    onSuccess: (data: any) => {
      setTotalObjects(data.meta.total);
    },
  });

  if (isError) {
    return <IndexGroupRequestersError />;
  }

  if (isLoading || isFetching) {
    return <IndexGroupRequestersSkeleton />;
  }

  if (!data.meta.total) {
    return <IndexGroupRequestersEmpty />;
  }

  return (
    <>
      <GroupsTable data={data.groupRequesters} />
    </>
  );
};

export default GroupRequestersTableContainer;
