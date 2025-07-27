import * as React from 'react';
import router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { Icon, Item, Typography } from 'printer-ui';
import { useAuth, useSession } from '../../../../hooks';
import { DocumentService } from '../../../../services/printer-air';
import { DocumentsTableContainerProps } from './types';
import { sortMapping } from '../../Documents/Select';
import Pagination from '../../../../components/Pagination/Pagination';
import DocumentsTable from '../../../components/Documents/Table/Table';
import DocumentsSkeleton from './Skeleton';
import DocumentsSortSelect from '../Select/Select';

const getSortSelection = (
  order: string,
  direction: string
): Record<string, string> => {
  if (order === 'original_filename') {
    if (direction === 'asc') {
      return {
        id: '1',
        value: 'Ordem Alfabética A-Z',
      };
    } else {
      return {
        id: '2',
        value: 'Ordem Alfabética Z-A',
      };
    }
  } else if (order === 'created_at') {
    if (direction === 'desc') {
      return {
        id: '3',
        value: 'Mais recentes',
      };
    } else {
      return {
        id: '4',
        value: 'Mais antigos',
      };
    }
  }

  return {
    id: '1',
    value: 'Ordem Alfabética A-Z',
  };
};

const DocumentsTableContainer = ({
  directoryId,
  setSelectedDocumentIds,
}: DocumentsTableContainerProps) => {
  const { subdomain, token } = useAuth();
  const { session } = useSession();

  // const [page, setPage] = React.useState(1);
  const [page, setPage] = React.useState(
    router.query.documentsPage ? Number(router.query.documentsPage) : 1
  );

  // const direction = sortMapping[sortSelection.id].direction;
  // const order = sortMapping[sortSelection.id].order;
  const order = router.query.documentsOrder
    ? String(router.query.documentsOrder)
    : 'name';
  const direction = router.query.documentsDirection
    ? String(router.query.documentsDirection)
    : 'asc';

  // const [sortSelection, setSortSelection] = React.useState(sortOptions[0]);
  const [sortSelection, setSortSelection] = React.useState(
    getSortSelection(order, direction)
  );

  React.useEffect(() => {
    setPage(
      router.query.documentsPage ? Number(router.query.documentsPage) : 1
    );
  }, [router.query.documentsPage]);

  React.useEffect(() => {
    setSortSelection(getSortSelection(order, direction));
  }, [router.query.documentsOrder, router.query.documentsDirection]);

  const { isLoading, isError, data } = useQuery({
    queryKey: ['documents', { order, direction, page, directoryId, token }],
    queryFn: () =>
      DocumentService.index(token, subdomain, {
        direction,
        order,
        page,
        directoryId,
      }),
  });

  if (isError) {
    return (
      <div className="border border-lighterGray my-4 flex items-center space-x-2 justify-center py-7">
        <Icon alt="alert" name="alert" color="error" stroke />
        <Typography variant="footnote1" color="gray" align="center">
          Erro! Não foi possível carregar a página de documentos, tente
          novamente mais tarde.
        </Typography>
      </div>
    );
  }

  if (isLoading) {
    return <DocumentsSkeleton />;
  }

  const totalDocs = data.meta.total;
  const docsPerPage = 10;

  const handlePageChange = (page: number) => {
    const searchParams = new URLSearchParams(
      router.query as Record<string, string>
    );

    searchParams.delete('organizationId');
    searchParams.delete('directoryId');
    searchParams.set('documentsPage', String(page));

    router.push(
      `/printer-air/my-air/organizations/${
        session.organization.id
      }/directories/${session.directory.id}?${searchParams.toString()}`
    );
  };

  const handleSortChange = (item: Item) => {
    const searchParams = new URLSearchParams(
      router.query as Record<string, string>
    );

    searchParams.delete('organizationId');
    searchParams.delete('directoryId');
    searchParams.set('documentsOrder', String(sortMapping[item.id].order));
    searchParams.set(
      'documentsDirection',
      String(sortMapping[item.id].direction)
    );

    router.push(
      `/printer-air/my-air/organizations/${
        session.organization.id
      }/directories/${session.directory.id}?${searchParams.toString()}`
    );
  };

  if (data.meta.total === 0) {
    return (
      <div className="border border-lighterGray my-4 flex items-center space-x-2 justify-center py-7">
        <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
        <Typography variant="footnote1" color="gray" align="center">
          Você ainda não tem nenhum documento criado ou armazenado no seu
          Printer Air.
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
              setSortSelection={handleSortChange}
            />
          </div>
          <div className="sm:hidden">
            <DocumentsSortSelect
              w={44}
              sortSelection={sortSelection}
              setSortSelection={handleSortChange}
            />
          </div>
        </span>
        <Pagination
          page={page}
          setPage={handlePageChange}
          totalPages={Math.ceil(totalDocs / docsPerPage)}
          totalObjects={totalDocs}
          objectsPerPage={docsPerPage}
        />
      </div>
      <DocumentsTable
        data={data.documents}
        setSelectedDocumentIds={setSelectedDocumentIds}
      />
    </>
  );
};

export default DocumentsTableContainer;
