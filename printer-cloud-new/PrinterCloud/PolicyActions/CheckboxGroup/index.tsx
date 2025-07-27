import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { PolicyActionService } from '../../../services';
import { getSubdomain } from '../../../utils';
import { PolicyActionsCheckboxGroupContainerProps } from './types';
import PolicyActionsCheckboxGroupSkeleton from './Skeleton';
import PolicyActionsCheckboxGroupError from './Error';
import PolicyActionsCheckboxGroup from './CheckboxGroup';

const PolicyActionsCheckboxGroupContainer = ({
  service,
  disabled = false,
}: PolicyActionsCheckboxGroupContainerProps) => {
  const { token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['policyActions', { service, token }],
    queryFn: () =>
      PolicyActionService.index(token, getSubdomain(), {
        'service[]': service,
        order: 'access_level',
        direction: 'asc',
        perPage: 1000,
      }),
  });

  if (isLoading) return <PolicyActionsCheckboxGroupSkeleton />;

  if (isError) return <PolicyActionsCheckboxGroupError />;

  return (
    <PolicyActionsCheckboxGroup policyActions={data} disabled={disabled} />
  );
};

export default PolicyActionsCheckboxGroupContainer;
