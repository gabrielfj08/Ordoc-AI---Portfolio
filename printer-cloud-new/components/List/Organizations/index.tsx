import * as React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Icon, List, Typography } from 'printer-ui';
import { queryClient } from '../../../queryClient';
import { OrganizationService } from '../../../services';
import { getSubdomain } from '../../../utils';
import OrganizationsList from './Organizations';
import { useAuth } from '../../../hooks';
import Image from 'next/image';

const OrganizationsListContainer = ({ user_id, q }) => {
  const { ref, inView } = useInView();
  const { token } = useAuth();

  const {
    data,
    refetch,
    isError,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['users', user_id, 'organizations'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await OrganizationService.indexV3(token, getSubdomain(), {
        page: pageParam,
        user_id: user_id,
        q: q,
      });
      return res;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.organizations.length > 0) {
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
      queryKey: ['users', user_id, 'organizations'],
    });

    refetch();
  }, [q]);

  return (
    <div className="h-full w-full">
      {isLoading ? (
        <div className="h-80 items-center justify-center flex w-[38.5rem] space-x-2">
          <Image
            priority
            src="/assets/cloud.svg"
            width={30}
            height={30}
            className="animate-spin"
          />
        </div>
      ) : isError ? (
        <div className="h-80 items-center justify-center flex w-[38.5rem] space-x-2">
          <Icon name="alert" alt="alert" color="red" stroke w={26} h={26} />
          <Typography variant="footnote2" color="gray">
            Erro ao listar instituições
          </Typography>
        </div>
      ) : data?.pages[0].organizations.length === 0 ? (
        <div className="h-80 items-center justify-center flex sm:w-[38.5rem] w-full space-x-2">
          <Icon name="info" alt="info" color="gray" stroke w={26} h={26} />
          <Typography variant="footnote2" color="gray">
            Nenhuma instituição encontrada
          </Typography>
        </div>
      ) : (
        <div>
          <List className="relative sm:w-[38.5rem] w-full" h={96}>
            {data.pages.map((page, index) => (
              <OrganizationsList
                user_id={user_id}
                page={page}
                organizations={page.organizations}
                key={index}
              />
            ))}
            {isFetchingNextPage || hasNextPage ? (
              <div ref={ref}>
                <div className="flex justify-center py-2">
                  <Image
                    priority
                    src="/assets/cloud.svg"
                    width={30}
                    height={30}
                    className="animate-spin"
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

export default OrganizationsListContainer;
