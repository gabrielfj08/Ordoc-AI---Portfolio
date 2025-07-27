import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icon, Typography } from 'printer-ui';
import { useAuth, useSession } from '../../../../hooks';
import { DocumentService } from '../../../../services/printer-air';
import { getSubdomain } from '../../../../utils';
import { RecycleBinDocumentsTableContainerProps } from './types';
import DocumentsSortSelect, { sortMapping, sortOptions } from '../Select';
import DocumentsSkeleton from './Skeleton';
import Pagination from '../../../../components/Pagination/Pagination';
import DocumentsTable from './Table';
import DocumentsTableError from './Error';

const RecycleBinDocumentsTableContainer = ({
  setSelectedDocuments,
}: RecycleBinDocumentsTableContainerProps) => {
  const { token } = useAuth();
  const { session } = useSession();

  const [sortSelection, setSortSelection] = React.useState(sortOptions[0]);
  const [page, setPage] = React.useState(1);

  const direction = sortMapping[sortSelection.id].direction;
  const order = sortMapping[sortSelection.id].order;

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      'documents',
      session.organization,
      { order, direction, page, token },
    ],
    queryFn: () =>
      DocumentService.index(token, getSubdomain(), {
        direction,
        order,
        page,
        directoryId: session.organization.recycleBinDirectory.id,
      }),
  });

  if (isError) {
    return <DocumentsTableError />;
  }

  if (isLoading) {
    return <DocumentsSkeleton />;
  }

  const totalDocs = data.meta.total;
  const docsPerPage = 10;

  if (data.meta.total === 0) {
    return (
      <div className="border border-lighterGray my-4 flex items-center space-x-2 justify-center py-7">
        <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
        <Typography variant="footnote1" color="gray" align="center">
          Lixeira vazia.
        </Typography>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center my-4">
        <span className="flex items-center sm:space-x-2.5">
          <Typography
            variant="footnote1"
            color="gray"
            className="hidden sm:block"
          >
            Ordenar arquivos por
          </Typography>
          <div className="hidden sm:block">
            <DocumentsSortSelect
              w={52}
              sortSelection={sortSelection}
              setSortSelection={setSortSelection}
            />
          </div>
          <div className="sm:hidden">
            <DocumentsSortSelect
              w={44}
              sortSelection={sortSelection}
              setSortSelection={setSortSelection}
            />
          </div>
        </span>
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={Math.ceil(totalDocs / docsPerPage)}
          totalObjects={totalDocs}
          objectsPerPage={docsPerPage}
        />
      </div>
      <DocumentsTable
        data={data.documents}
        setSelectedDocuments={setSelectedDocuments}
      />
    </>
  );
};

export default RecycleBinDocumentsTableContainer;
