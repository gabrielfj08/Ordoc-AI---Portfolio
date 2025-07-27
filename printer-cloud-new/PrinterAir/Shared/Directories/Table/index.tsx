import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icon, Typography } from 'printer-ui';
import { useAuth } from '../../../../hooks';
import { SharedDirectoryWithMeService } from '../../../../services/printer-air';
import { SharedDirectoriesTableContainerProps } from './types';
import Pagination from '../../../../components/Pagination/Pagination';
import SharedDirectoriesTableError from './Error';
import SharedDirectoriesTableSkeleton from './Skeleton';
import SharedDirectoriesTable from '../../../components/Shared/Directories/Directories';

const SharedDirectoriesTableContainer = ({
  organizationId,
  root,
  parentSharedId,
}: SharedDirectoriesTableContainerProps) => {
  const { subdomain, token } = useAuth();
  const [page, setPage] = React.useState(1);

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      'sharedDirectories',
      { organizationId, root, parentSharedId, page, token },
    ],
    queryFn: () =>
      parentSharedId == null
        ? SharedDirectoryWithMeService.index(token, subdomain, organizationId, {
            page: page,
            root: root,
          })
        : SharedDirectoryWithMeService.index(token, subdomain, organizationId, {
            page: page,
            parentSharedId: parentSharedId,
          }),
  });

  React.useEffect(() => {
    setPage(1);
  }, [parentSharedId]);

  if (isError) return <SharedDirectoriesTableError />;

  if (isLoading) return <SharedDirectoriesTableSkeleton />;

  const totalDocs = data.meta.total;
  const docsPerPage = 10;

  if (data.meta.total === 0) {
    return (
      <div className="border border-lighterGray my-4 flex items-center space-x-2 justify-center py-7">
        <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
        <Typography variant="footnote1" color="gray" align="center">
          {parentSharedId == null
            ? 'Nenhuma pasta foi compartilhada com você até o momento.'
            : 'Nenhuma pasta'}
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
      <SharedDirectoriesTable data={data.sharedDirectories} />
    </>
  );
};

export default SharedDirectoriesTableContainer;
