import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../../hooks';
import { GroupRequesterService } from '../../../../../../services/printer-flow';
import { SelectGroupContainerProps } from './types';
import SelectGroupError from './Error';
import SelectGroupEmpty from './Empty';
import SelectGroup from './SelectGroupRequesters';
import SelectGroupSkeleton from './Skeleton';

const SelectGroupContainer = ({
  userId,
  currentGroup,
  setCurrentGroup,
}: SelectGroupContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['groupRequester', token, userId],
    queryFn: () =>
      GroupRequesterService.index(token, subdomain, {
        userId: userId,
        status: 'active',
      }),
  });

  if (isError) return <SelectGroupError />;

  if (isLoading) return <SelectGroupSkeleton />;

  if (!data.meta.total) return <SelectGroupEmpty />;

  return (
    <SelectGroup
      groupRequesters={data.groupRequesters}
      currentGroup={currentGroup}
      setCurrentGroup={setCurrentGroup}
    />
  );
};

export default SelectGroupContainer;
