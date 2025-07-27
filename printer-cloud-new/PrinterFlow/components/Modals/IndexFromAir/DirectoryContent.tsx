import * as React from 'react';
import { Typography } from 'printer-ui';
import { DirectoryContentProps } from './types';
import { TotalObject } from './IndexDocuments/types';
import IndexDirectoriesFromAirSkeleton from './IndexDirectories/Skeleton';
import IndexDirectoriesFromAir from './IndexDirectories';
import IndexDocumentsFromAir from './IndexDocuments';

const DirectoryContent = ({
  directoryId,
  setDirectoryId,
  formik,
  isAuthorized,
}: DirectoryContentProps) => {
  const [total, setTotal] = React.useState<TotalObject>({
    directories: null,
    documents: null,
  });

  const initialTotal = total.directories === null && total.documents === null;
  const emptyDirectory =
    !initialTotal && Number(total.directories) + Number(total.documents) === 0;

  return (
    <>
      <div className={`${initialTotal ? 'block space-y-4' : 'hidden'}`}>
        <IndexDirectoriesFromAirSkeleton />
        <IndexDirectoriesFromAirSkeleton />
      </div>
      <div
        className={`${
          initialTotal
            ? 'hidden'
            : emptyDirectory
            ? 'hidden'
            : !isAuthorized
            ? 'hidden'
            : 'block space-y-4'
        }`}
      >
        <IndexDirectoriesFromAir
          setDirectoryId={setDirectoryId}
          directoryId={directoryId}
          total={total}
          setTotal={setTotal}
        />
        <IndexDocumentsFromAir
          formik={formik}
          setDirectoryId={setDirectoryId}
          directoryId={directoryId}
          total={total}
          setTotal={setTotal}
        />
      </div>
      <div
        className={`${
          emptyDirectory && isAuthorized ? 'flex pt-8 justify-center' : 'hidden'
        }`}
      >
        <Typography variant="footnote1" color="gray">
          Nenhum arquivo encontrado.
        </Typography>
      </div>
    </>
  );
};

export default DirectoryContent;
