import * as React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { queryClient } from '../../../../queryClient';
import { useAuth } from '../../../../hooks';
import { GroupRequesterService } from '../../../../services/printer-flow';
import { RequestersListContainerProps } from './types';
import ListError from './Error';
import ListLoading from './Loading';
import ListEmpty from './Empty';
import RequestersList from './List';

const RequestersListContainer = ({
  groupId,
  groupName,
  status,
  q,
}: RequestersListContainerProps) => {
  const { subdomain, token } = useAuth();
  const { ref, inView } = useInView();

  const {
    data,
    refetch,
    isError,
    isFetching,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [
      'groupRequestersList',
      subdomain,
      token,
      { q, order: 'name', direction: 'asc' },
    ],
    queryFn: ({ pageParam = 1 }) =>
      GroupRequesterService.indexRequestersFromGroup(
        token,
        subdomain,
        groupId,
        { q, order: 'name', direction: 'asc', page: pageParam }
      ),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.requestersFromGroup.length > 0) {
        return allPages.length + 1;
      }
    },
  });

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  React.useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['groupRequester', subdomain, token, {}],
    });

    refetch();
  }, [q]);

  if (isError) return <ListError />;

  if (isLoading || isFetching) return <ListLoading />;

  if (data.pages[0].requestersFromGroup.length === 0) return <ListEmpty />;

  return (
    <>
      {data.pages.map((page, index) => (
        <RequestersList
          requesters={page.requestersFromGroup}
          groupId={groupId}
          status={status}
          groupName={groupName}
          page={page}
          key={index}
        />
      ))}
      <div ref={ref}>
        {isFetchingNextPage || hasNextPage ? <ListLoading /> : null}
      </div>
    </>
  );
};

export default RequestersListContainer;
