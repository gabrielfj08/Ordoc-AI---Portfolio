import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icon, Typography } from 'printer-ui';
import { useAuth } from '../../../hooks';
import { RecentDocumentService } from '../../../services/printer-air';
import { RecentsTableContainerProps } from './types';
import RecentsTable from '../../components/Recents/Table';
import RecentDocumentsSkeleton from './Skeleton';
import RecentDocumentError from './Error';

const RecentsTableContainer = ({
  organizationId,
  setSelectedDocumentIds,
}: RecentsTableContainerProps) => {
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      'recentDocuments',
      { order: 'last_accessed_at', direction: 'desc', organizationId, token },
    ],
    queryFn: () =>
      RecentDocumentService.index(token, subdomain, {
        direction: 'desc',
        order: 'last_accessed_at',
        organizationId,
        path: '/Meu Air',
      }),
  });

  if (isError) {
    return <RecentDocumentError />;
  }

  if (isLoading) {
    return <RecentDocumentsSkeleton />;
  }

  if (data.meta.total === 0) {
    return (
      <div className="border border-lighterGray my-4 flex items-center space-x-2 justify-center py-7">
        <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
        <Typography variant="footnote1" color="gray" align="center">
          Você ainda não possui nenhum arquivo acessado recentemente.
        </Typography>
      </div>
    );
  }

  return (
    <RecentsTable
      data={data.recentDocument}
      setSelectedDocumentIds={setSelectedDocumentIds}
    />
  );
};

export default RecentsTableContainer;
