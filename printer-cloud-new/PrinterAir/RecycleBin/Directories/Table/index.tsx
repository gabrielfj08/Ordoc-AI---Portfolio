import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icon, Typography } from 'printer-ui';
import { useAuth, useSession } from '../../../../hooks';
import { DirectoryService } from '../../../../services/printer-air';
import { RecycleBinDirectoriesTableContainerProps } from './types';
import DirectoriesSortSelect, {
  sortMapping,
  sortOptions,
} from '../../Directories/Select';
import DirectoriesTableSkeleton from './Skeleton';
import DirectoriesTableError from './Error';
import Pagination from '../../../../components/Pagination/Pagination';
import DirectoriesTable from './Table';

const RecycleBinDirectoriesTableContainer = ({
  setSelectedDirectories,
}: RecycleBinDirectoriesTableContainerProps) => {
  const { subdomain, token } = useAuth();
  const { session } = useSession();

  const [sortSelection, setSortSelection] = React.useState(sortOptions[0]);
  const [page, setPage] = React.useState(1);

  const direction = sortMapping[sortSelection.id].direction;
  const order = sortMapping[sortSelection.id].order;

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      'directories',
      session.organization,
      { order, direction, page, token },
    ],
    queryFn: () =>
      DirectoryService.index(token, subdomain, session.organization.id, {
        direction,
        order,
        page,
        directoryId: session.organization.recycleBinDirectory.id,
      }),
  });

  if (isError) {
    return <DirectoriesTableError />;
  }

  if (isLoading) {
    return <DirectoriesTableSkeleton />;
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
            Ordenar pastas por
          </Typography>
          <div className="hidden sm:block">
            <DirectoriesSortSelect
              w={52}
              sortSelection={sortSelection}
              setSortSelection={setSortSelection}
            />
          </div>
          <div className="sm:hidden">
            <DirectoriesSortSelect
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
      <DirectoriesTable
        data={data.directories}
        setSelectedDirectories={setSelectedDirectories}
      />
    </>
  );
};

export default RecycleBinDirectoriesTableContainer;
