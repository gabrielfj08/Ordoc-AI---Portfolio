import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useSession } from '../../../hooks';
import { AppService } from '../../../services';
import { AppsRadioGroupContainerProps } from './types';
import AppsRadioGroupSkeleton from './Skeleton';
import AppsRadioGroupError from './Error';
import AppsRadioGroup from './RadioGroup';

const AppsRadioGroupContainer = ({
  disabled = false,
}: AppsRadioGroupContainerProps) => {
  const { token, subdomain } = useAuth();
  const { session } = useSession();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['apps', { token }],
    queryFn: () =>
      AppService.index(token, subdomain, {
        order: 'name',
        direction: 'asc',
        organizationId: session.organization.id,
      }),
  });

  if (isLoading) return <AppsRadioGroupSkeleton />;

  if (isError) return <AppsRadioGroupError />;

  return <AppsRadioGroup apps={data} disabled={disabled} />;
};

export default AppsRadioGroupContainer;
