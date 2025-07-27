import * as React from 'react';
import Image from 'next/image';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Icon, List, Typography } from 'printer-ui';
import { queryClient } from '../../../queryClient';
import { useAuth } from '../../../hooks';
import { PolicyService } from '../../../services';
import { PoliciesListContainerProps } from './types';
import PoliciesList from './Policies';

const PoliciesListContainer = ({
  group,
  group_id,
  organization_id,
  q,
  userID,
}: PoliciesListContainerProps) => {
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
    queryKey: userID
      ? ['users', userID, 'policies']
      : ['userGroups', group_id, 'policies'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await PolicyService.index(token, subdomain, {
        page: pageParam,
        user_group_id: group_id,
        organization_id: organization_id,
        q: q,
        user_id: userID,
      });
      return res;
    },

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.policies.length > 0) {
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
      queryKey: userID
        ? ['users', userID, 'policies']
        : ['userGroups', group_id, 'policies'],
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
            Erro ao listar permissões
          </Typography>
        </div>
      ) : data?.pages[0].policies.length === 0 ? (
        <div className="h-80 items-center justify-center flex sm:w-[38.5rem] w-full space-x-2">
          <Icon name="info" alt="info" color="gray" stroke w={26} h={26} />
          <Typography variant="footnote2" color="gray">
            Nenhuma permissão encontrada
          </Typography>
        </div>
      ) : (
        <div>
          <List className="relative sm:w-[38.5rem] w-full" h={80}>
            {data.pages.map((page, index) => (
              <PoliciesList
                group={group}
                userID={userID}
                policies={page.policies}
                page={page}
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

export default PoliciesListContainer;
