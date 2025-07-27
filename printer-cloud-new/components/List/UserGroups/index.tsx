import * as React from 'react';
import Image from 'next/image';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Icon, List, Typography } from 'printer-ui';
import { useAuth } from '../../../hooks';
import { queryClient } from '../../../queryClient';
import { UserGroupService } from '../../../services';
import UserGroupsList from './UserGroups';

const UserGroupsListContainer = ({ user_id, policy, policy_id, q }) => {
  const { ref, inView } = useInView();
  const { token, subdomain } = useAuth();

  const {
    data,
    refetch,
    isError,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: user_id
      ? ['users', user_id, 'userGroups', token]
      : ['policies', policy_id, 'userGroups', token],
    queryFn: ({ pageParam = 1 }) =>
      UserGroupService.indexV3(token, subdomain, {
        page: pageParam,
        user_id: user_id,
        policy_id: policy_id,
        q: q,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.userGroups?.length > 0) {
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
      queryKey: user_id
        ? ['users', user_id, 'userGroups']
        : ['policies', policy_id, 'users'],
    });

    refetch();
  }, [q]);

  return (
    <div className="h-full w-full">
      {isLoading ? (
        <div className="h-80 items-center justify-center flex sm:w-[38.5rem] w-full space-x-2">
          <Image
            src="/assets/cloud.svg"
            width={30}
            height={30}
            className="animate-spin"
            priority
          />
        </div>
      ) : isError ? (
        <div className="h-80 items-center justify-center flex sm:w-[38.5rem] w-full space-x-2">
          <Icon name="info" alt="info" color="red" stroke w={26} h={26} />
          <Typography variant="footnote2" color="gray">
            Erro ao listar grupos.
          </Typography>
        </div>
      ) : data.pages[0].userGroups.length === 0 ? (
        <div className="h-80 items-center justify-center flex sm:w-[38.5rem] w-full space-x-2">
          <Icon name="info" alt="info" color="gray" stroke w={26} h={26} />
          <Typography variant="footnote2" color="gray">
            Nenhum grupo encontrado.
          </Typography>
        </div>
      ) : (
        <div>
          <List className="relative sm:w-[38.5rem] w-full" h={80}>
            {data.pages.map((page, index) => (
              <UserGroupsList
                page={page}
                userGroups={page}
                user_id={user_id}
                policy={policy}
                key={index}
              />
            ))}
            {isFetchingNextPage || hasNextPage ? (
              <div ref={ref}>
                <div className="flex justify-center py-2">
                  <Image
                    src="/assets/cloud.svg"
                    width={30}
                    height={30}
                    className="animate-spin"
                    priority
                  />
                </div>
              </div>
            ) : null}
          </List>
        </div>
      )}
    </div>
  );
};

export default UserGroupsListContainer;
