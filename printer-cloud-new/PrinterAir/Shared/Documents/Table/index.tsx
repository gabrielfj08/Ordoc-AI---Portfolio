import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icon, Typography } from 'printer-ui';
import { useAuth } from '../../../../hooks';
import { SharedDocumentWithMeService } from '../../../../services/printer-air';
import { SharedDocumentsTableContainerProps } from './types';
import Pagination from '../../../../components/Pagination/Pagination';
import SharedDocumentsTableError from './Error';
import SharedDocumentsTableSkeleton from './Skeleton';
import SharedDocumentsTable from '../../../components/Shared/Documents/Documents';

const SharedDocumentsTableContainer = ({
  organizationId,
  root,
  parentSharedId,
}: SharedDocumentsTableContainerProps) => {
  const { subdomain, token } = useAuth();
  const [page, setPage] = React.useState(1);

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      'sharedDocuments',
      { organizationId, root, parentSharedId, page, token },
    ],
    queryFn: () =>
      // TODO: MOVE CONDITIONAL TO SERVICE OR API PAGE
      parentSharedId == null
        ? SharedDocumentWithMeService.index(token, subdomain, organizationId, {
            page: page,
            root: root,
          })
        : SharedDocumentWithMeService.index(token, subdomain, organizationId, {
            page: page,
            parentSharedId: parentSharedId,
          }),
  });

  if (isError) return <SharedDocumentsTableError />;

  if (isLoading) return <SharedDocumentsTableSkeleton />;

  const totalDocs = data.meta.total;
  const docsPerPage = 10;

  if (data.meta.total === 0) {
    return (
      <div className="border border-lighterGray my-4 flex items-center space-x-2 justify-center py-7">
        <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
        <Typography variant="footnote1" color="gray" align="center">
          {parentSharedId == null
            ? 'Nenhum arquivo foi compartilhado com você até o momento.'
            : 'Nenhum arquivo'}
        </Typography>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end items-center my-4">
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={Math.ceil(totalDocs / docsPerPage)}
          totalObjects={totalDocs}
          objectsPerPage={docsPerPage}
        />
      </div>
      <SharedDocumentsTable data={data.sharedDocuments} />
    </>
  );
};

export default SharedDocumentsTableContainer;
