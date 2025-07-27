import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import Public from '../../../services/printer-cloud/Public';
import SystemInformation from './SystemInformation';
import SystemInformationSkeleton from './Skeleton';
import SystemInformationError from './Error';

const SystemInformationContainer = () => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['about'],
    queryFn: () => Public.about(),
  });

  if (isLoading) return <SystemInformationSkeleton />;

  if (isError) return <SystemInformationError />;

  return <SystemInformation about={data.data} />;
};

export default SystemInformationContainer;
