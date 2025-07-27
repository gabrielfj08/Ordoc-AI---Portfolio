import * as React from 'react';
import Image from 'next/image';
import { queryClient } from '../../../queryClient';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Icon, List, Typography } from 'printer-ui';
import { useAuth } from '../../../hooks';
import { UserService } from '../../../services';
import UsersList from './Users';

const UsersContainer = ({ userGroup, groupID, policy, policy_id, q }) => {
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
    queryKey: groupID
      ? ['userGroups', userGroup.id, 'users', token]
      : ['policies', policy_id, 'users', token],
    queryFn: ({ pageParam = 1 }) =>
      UserService.index(token, subdomain, {
        direction: 'asc',
        order: 'name',
        q,
        printer_cloud_user_group_id: groupID,
        policy_id: policy_id,
        status: '',
        page: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.users.length > 0) {
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
      queryKey: groupID
        ? ['userGroups', groupID, 'users']
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
            Erro ao listar usuários.
          </Typography>
        </div>
      ) : data.pages[0].users.length === 0 ? (
        <div className="h-80 items-center justify-center flex sm:w-[38.5rem] w-full space-x-2">
          <Icon name="info" alt="info" color="gray" stroke w={26} h={26} />
          <Typography variant="footnote2" color="gray">
            Nenhum usuário encontrado.
          </Typography>
        </div>
      ) : (
        <List className="relative sm:w-[38.5rem] w-full h-96" h={80}>
          {data.pages.map((page, index) => (
            <UsersList
              users={page.users}
              page={page}
              userGroup={userGroup}
              key={index}
              policy={policy}
            />
          ))}
          <div ref={ref}>
            {isFetchingNextPage || hasNextPage ? (
              <div className="flex justify-center py-2">
                <Image
                  src="/assets/cloud.svg"
                  width={30}
                  height={30}
                  className="animate-spin"
                  priority
                />
              </div>
            ) : null}
          </div>
        </List>
      )}
    </div>
  );
};

export default UsersContainer;
