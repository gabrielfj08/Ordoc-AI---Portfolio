import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { OrganizationService } from '../../../services';
import { getSubdomain } from '../../../utils';
import { SelectOrganizationContainerProps } from './types';
import SelectOrganizationSkeleton from './Skeleton';
import SelectOrganizationError from './Error';
import SelectOrganization from './Select';

const SelectOrganizationsContainer = ({
  name,
  onChange,
}: SelectOrganizationContainerProps) => {
  const { token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['organizations', { token }],
    queryFn: () => OrganizationService.indexV3(token, getSubdomain(), {}),
  });

  if (isLoading) return <SelectOrganizationSkeleton />;

  if (isError) return <SelectOrganizationError />;

  return (
    <SelectOrganization
      name={name}
      onChange={onChange}
      organizations={data.organizations}
    />
  );
};

export default SelectOrganizationsContainer;
