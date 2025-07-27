import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useSession } from '../../../../../hooks';
import { UserService, AppService } from '../../../../../services';
import { FlowProfileContainerProps } from './types';
import SkeletonFlowProfile from './Skeleton';
import ErrorFlowProfile from './Error';
import FlowProfile from './Profile';

const FlowProfileContainer = ({
  currentGroup,
  setCurrentGroup,
}: FlowProfileContainerProps) => {
  const { token, subdomain } = useAuth();
  const { session } = useSession();

  const {
    isLoading: isLoadingUser,
    isError: isErrorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ['me', token],
    queryFn: () => UserService.me(token, subdomain),
  });

  const {
    isLoading: isLoadingApps,
    isError: isErrorApps,
    data: dataApps,
  } = useQuery({
    queryKey: ['apps', token],
    queryFn: () =>
      AppService.index(token, subdomain, {
        order: 'name',
        direction: 'asc',
        organizationId: session.organization.id,
      }),
  });

  if (isLoadingUser || isLoadingApps) return <SkeletonFlowProfile />;

  if (isErrorUser || isErrorApps) return <ErrorFlowProfile />;

  return (
    <FlowProfile
      user={dataUser}
      apps={dataApps}
      currentGroup={currentGroup}
      setCurrentGroup={setCurrentGroup}
    />
  );
};

export default FlowProfileContainer;
