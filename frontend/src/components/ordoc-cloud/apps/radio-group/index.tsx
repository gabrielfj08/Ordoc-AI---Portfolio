'use client';

import * as React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppsRadioGroupContainerProps, App } from './types';
import AppsRadioGroupSkeleton from './Skeleton';
import AppsRadioGroupError from './Error';
import AppsRadioGroup from './RadioGroup';

const AppsRadioGroupContainer = ({
  disabled = false,
}: AppsRadioGroupContainerProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [apps, setApps] = React.useState<App[]>([]);

  React.useEffect(() => {
    const loadApps = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        
        // Mock data for now - in real implementation, this would call the API
        // const response = await AppService.index(token, subdomain, {
        //   order: 'name',
        //   direction: 'asc',
        //   organizationId: user?.organization?.id,
        // });
        
        // Mock apps data
        const mockApps: App[] = [
          { id: 1, name: 'OrdocAir', service: 'ordoc_air', status: 'active' },
          { id: 2, name: 'OrdocFlow', service: 'ordoc_flow', status: 'active' },
          { id: 3, name: 'OrdocSign', service: 'ordoc_sign', status: 'active' },
          { id: 4, name: 'OrdocReports', service: 'ordoc_reports', status: 'inactive' },
        ];
        
        setApps(mockApps);
      } catch (error) {
        console.error('Error loading apps:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadApps();
  }, [user]);

  if (isLoading) return <AppsRadioGroupSkeleton />;

  if (isError) return <AppsRadioGroupError />;

  return <AppsRadioGroup apps={apps} disabled={disabled} />;
};

export default AppsRadioGroupContainer;
