import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useSession } from '../../../hooks';
import { DocumentVersionService } from '../../../services/printer-air';
import { DocumentVersionsContainerProps } from './types';
import DocumentVersionsError from './Error';
import DocumentVersionsSkeleton from './Skeleton';
import DocumentVersionsEmpty from './Empty';
import DocumentVersion from './DocumentVersion';

const DocumentVersionsContainer = ({
  document,
}: DocumentVersionsContainerProps) => {
  const { token, subdomain } = useAuth();
  const { session } = useSession();

  const { isLoading, isError, isFetching, data } = useQuery({
    queryKey: [
      'documentVersions',
      { organizationId: session.organization?.id, token },
    ],
    queryFn: () =>
      DocumentVersionService.index(
        token,
        subdomain,
        Number(session.organization?.id),
        {
          order: 'created_at',
          direction: 'desc',
          page: 1,
          perPage: 100,
          path: document.path,
        }
      ),
  });

  if (isError) {
    return <DocumentVersionsError />;
  }

  if (isLoading || isFetching) {
    return <DocumentVersionsSkeleton />;
  }

  if (!data.meta.total) return <DocumentVersionsEmpty />;

  return (
    <div className="flex flex-col gap-5">
      {data.documentVersions.map((documentVersion, index) => (
        <div key={documentVersion.id}>
          <DocumentVersion
            documentVersion={documentVersion}
            title={`Versão ${
              index === 0 ? 'atual' : data.documentVersions.length - index
            }`}
            total={data.meta.total}
          />
        </div>
      ))}
    </div>
  );
};

export default DocumentVersionsContainer;
