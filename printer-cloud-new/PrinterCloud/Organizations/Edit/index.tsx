import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { OrganizationService } from '../../../services';
import {
  EditOrganizationContainerProps,
  EditOrganizationFormValues,
} from './types';
import EditOrganization from './Edit';

const EditOrganizationContainer = ({
  organizationId,
}: EditOrganizationContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['organizations', organizationId, { token }],
    queryFn: () => OrganizationService.showV3(token, subdomain, organizationId),
  });

  if (isLoading) {
    return null;
  }

  if (isError) {
    return null;
  }

  const handleSubmit = (values: EditOrganizationFormValues) => {
    return OrganizationService.update(token, subdomain, organizationId, values);
  };

  return <EditOrganization data={data} onSubmit={handleSubmit} />;
};

export default EditOrganizationContainer;
