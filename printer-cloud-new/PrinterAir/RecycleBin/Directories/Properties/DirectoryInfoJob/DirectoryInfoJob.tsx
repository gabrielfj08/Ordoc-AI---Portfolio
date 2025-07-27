import * as React from 'react';
import { Typography, Icon } from 'printer-ui';
import { DirectoryInfoJobProps } from './types';

const DirectoryInfoJob = ({ directoryInfo }: DirectoryInfoJobProps) => {
  const boxClassName =
    'w-full h-fit bg-lighterGray py-5 px-3.5 rounded-lg border border-lightGray flex space-x-2.5 items-center shadow-default';

  return (
    <>
      <div className="flex flex-col xl:flex-row xl:space-x-4 space-y-5 xl:space-y-0">
        <div className={`${boxClassName} xl:flex-col xl:space-y-2`}>
          <Icon name="folderOutlined" alt="folder" stroke w={26} h={26} />
          <div className="space-y-2">
            <Typography variant="footnote1" family="robotoMedium">
              Nº de pastas:
            </Typography>
            <Typography variant="footnote1" className="xl:text-center">
              {directoryInfo.totalDirectoriesCount}
            </Typography>
          </div>
        </div>
        <div className={`${boxClassName} xl:flex-col xl:space-y-2`}>
          <Icon name="pdfFileV2" alt="storage" fill w={26} h={26} />
          <div className="space-y-2">
            <Typography variant="footnote1" family="robotoMedium">
              Nº de arquivos:
            </Typography>
            <Typography variant="footnote1" className="xl:text-center">
              {directoryInfo.totalDocumentsCount}
            </Typography>
          </div>
        </div>
      </div>

      <div className={boxClassName}>
        <Icon name="storage" alt="storage" fill w={26} h={26} />
        <div className="space-y-2">
          <Typography variant="footnote1" family="robotoMedium">
            Tamanho:
          </Typography>
          <Typography variant="footnote1">{directoryInfo.totalSize}</Typography>
        </div>
      </div>
    </>
  );
};

export default DirectoryInfoJob;
