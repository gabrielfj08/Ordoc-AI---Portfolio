import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { OrganizationService } from '../../../services';
import { getSubdomain } from '../../../utils';
import { ShowOrganizationContainerProps } from './types';
import ShowOrganization from './Show';

const ShowOrganizationContainer = ({
  organizationId,
}: ShowOrganizationContainerProps) => {
  const { token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['organizations', organizationId, { token }],
    queryFn: () =>
      OrganizationService.showV3(token, getSubdomain(), organizationId),
  });

  if (isLoading) return null;

  if (isError) return null;

  return <ShowOrganization organization={data} />;
};

export default ShowOrganizationContainer;
