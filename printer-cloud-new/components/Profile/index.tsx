import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icon, Typography } from 'printer-ui';
import { useAuth, useSession } from '../../hooks';
import { UserService, AppService } from '../../services';
import { ProfileContainerProps } from './types';
import Skeleton from './Skeleton';
import Profile from './Profile';

const ProfileContainer = ({ currentOrganizationId }: ProfileContainerProps) => {
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

  if (isLoadingUser || isLoadingApps) {
    return <Skeleton />;
  }

  if (isErrorUser || isErrorApps) {
    return (
      <div className="w-56 items-center justify-center">
        <Icon name="alert" alt="alert" color="red" stroke w={26} h={26} />
        <Typography variant="footnote2" color="gray">
          Erro ao carregar as informações do perfil!
        </Typography>
      </div>
    );
  }

  return (
    <Profile
      user={dataUser}
      currentOrganizationId={currentOrganizationId}
      apps={dataApps}
    />
  );
};

export default ProfileContainer;
