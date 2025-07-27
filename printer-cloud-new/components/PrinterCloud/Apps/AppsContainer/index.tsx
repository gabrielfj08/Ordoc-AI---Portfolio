import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { useSession } from '../../../../hooks';
import { AppService } from '../../../../services';
import { AppsContainerProps } from './types';
import HomePageSkeleton from './AppsSkeleton';
import AppsError from './AppsError';
import Apps from './Apps';

const AppsContainer = ({ organizations }: AppsContainerProps) => {
  const { token, subdomain } = useAuth();
  const { session } = useSession();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['apps', token],
    queryFn: () =>
      AppService.index(token, subdomain, {
        order: 'name',
        direction: 'asc',
        organizationId: session.organization.id,
      }),
  });

  if (isError) return <AppsError />;

  if (isLoading) return <HomePageSkeleton />;

  return <Apps apps={data} organizations={organizations} />;
};

export default AppsContainer;
