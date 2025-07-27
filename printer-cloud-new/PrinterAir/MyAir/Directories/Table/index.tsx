import * as React from 'react';
import router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { Icon, Item, Typography } from 'printer-ui';
import { useAuth, useSession } from '../../../../hooks';
import { DirectoryService } from '../../../../services/printer-air';
import { DirectoriesTableContainerProps } from './types';
import DirectoriesSortSelect, { sortMapping } from '../../Directories/Select';
import DirectoriesSkeleton from './Skeleton';
import Pagination from '../../../../components/Pagination/Pagination';
import DirectoriesTable from '../../../components/Directories/Table/Table';

const getSortSelection = (
  order: string,
  direction: string
): Record<string, string> => {
  if (order === 'name') {
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

const DirectoriesTableContainer = ({
  organizationId,
  parentDirectoryId,
  setSelectedDirectoryIds,
}: DirectoriesTableContainerProps) => {
  const { subdomain, token } = useAuth();
  const { session } = useSession();

  const [page, setPage] = React.useState(
    router.query.directoriesPage ? Number(router.query.directoriesPage) : 1
  );

  const order = router.query.directoriesOrder
    ? String(router.query.directoriesOrder)
    : 'name';
  const direction = router.query.directoriesDirection
    ? String(router.query.directoriesDirection)
    : 'asc';

  const [sortSelection, setSortSelection] = React.useState(
    getSortSelection(order, direction)
  );

  React.useEffect(() => {
    setPage(
      router.query.directoriesPage ? Number(router.query.directoriesPage) : 1
    );
  }, [router.query.directoriesPage]);

  React.useEffect(() => {
    setSortSelection(getSortSelection(order, direction));
  }, [router.query.directoriesOrder, router.query.directoriesDirection]);

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      'directories',
      {
        organizationId,
        parentDirectoryId,
        order,
        direction,
        page,
        token,
      },
    ],
    queryFn: () =>
      DirectoryService.index(token, subdomain, organizationId, {
        direction,
        order,
        page,
        directoryId: parentDirectoryId,
      }),
  });

  if (isError) {
    return (
      <div className="border border-lighterGray my-4 flex items-center space-x-2 justify-center py-7">
        <Icon alt="alert" name="alert" color="error" stroke />
        <Typography variant="footnote1" color="gray" align="center">
          Erro! Não foi possível carregar a página de pastas, tente novamente
          mais tarde.
        </Typography>
      </div>
    );
  }

  if (isLoading) {
    return <DirectoriesSkeleton />;
  }

  const totalDocs = data.meta.total;
  const docsPerPage = 10;

  if (data.meta.total === 0) {
    return (
      <div className="border border-lighterGray my-4 flex items-center space-x-2 justify-center py-7">
        <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
        <Typography variant="footnote1" color="gray" align="center">
          Você ainda não tem nenhuma pasta criada ou armazenada no seu Printer
          Air.
        </Typography>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    const searchParams = new URLSearchParams(
      router.query as Record<string, string>
    );

    searchParams.delete('organizationId');
    searchParams.delete('directoryId');
    searchParams.set('directoriesPage', String(page));

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
    searchParams.set('directoriesOrder', String(sortMapping[item.id].order));
    searchParams.set(
      'directoriesDirection',
      String(sortMapping[item.id].direction)
    );

    router.push(
      `/printer-air/my-air/organizations/${
        session.organization.id
      }/directories/${session.directory.id}?${searchParams.toString()}`
    );
  };

  return (
    <>
      <div className="flex justify-between items-center my-4">
        <span className="flex items-center sm:space-x-2.5">
          <Typography
            variant="footnote1"
            color="gray"
            className="hidden sm:block"
          >
            Ordenar pastas por
          </Typography>
          <div className="hidden sm:block">
            <DirectoriesSortSelect
              w={52}
              sortSelection={sortSelection}
              setSortSelection={handleSortChange}
            />
          </div>
          <div className="sm:hidden">
            <DirectoriesSortSelect
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
      <DirectoriesTable
        data={data.directories}
        setSelectedDirectoryIds={setSelectedDirectoryIds}
      />
    </>
  );
};

export default DirectoriesTableContainer;
