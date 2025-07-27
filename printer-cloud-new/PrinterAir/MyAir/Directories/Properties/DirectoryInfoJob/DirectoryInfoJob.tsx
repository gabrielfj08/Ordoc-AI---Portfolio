import * as React from 'react';
import { Typography, Icon } from 'printer-ui';
import { DirectoryInfoJobProps } from './types';

const DirectoryInfoJob = ({ directoryInfo }: DirectoryInfoJobProps) => {
  return (
    <main className="h-full max-w-full p-4 sm:p-6 overflow-y-auto sm:-mt-8 -mt-4">
      <div className="sm:flex block pb-3">
        <div className="rounded-lg w-full sm:max-h-32 sm:h-20 h-16 items-center flex bg-lighterGray border border-lightGray shadow-default pl-2 ml-0 sm:mr-1.5">
          <Icon
            name="folderOutlined"
            alt="folderOutlined"
            stroke
            w={26}
            h={26}
          />
          <div className="grid justify-left items-center overflow-auto w-full h-full pl-3 mr-2 -space-y-8">
            <Typography
              variant="footnote1"
              family="robotoMedium"
              className="pb-2"
            >
              N° de pastas:
            </Typography>
            <Typography variant="footnote1">
              {directoryInfo.totalDirectoriesCount}
            </Typography>
          </div>
        </div>
        <div className="rounded-lg w-full sm:max-h-32 sm:h-20 h-16 items-center flex bg-lighterGray border border-lightGray shadow-default pl-2 sm:mt-0 mt-3 ml-0 sm:ml-1.5">
          <Icon name="pdfFileV2" alt="pdfFileV2" fill w={26} h={26} />
          <div className="grid justify-left items-center overflow-auto w-full h-full pl-3 mr-2 -space-y-8">
            <Typography
              variant="footnote1"
              family="robotoMedium"
              className="pb-2"
            >
              N° de arquivos:
            </Typography>
            <Typography variant="footnote1">
              {directoryInfo.totalDocumentsCount}
            </Typography>
          </div>
        </div>
      </div>

      <div className="rounded-lg w-full sm:max-h-32 sm:h-20 h-16 flex items-center bg-lighterGray border border-lightGray shadow-default pl-2">
        <Icon name="storage" alt="storage" fill w={26} h={26} />
        <div className="grid justify-left items-center overflow-auto w-full h-full pl-3 -space-y-6">
          <Typography variant="footnote1" family="robotoMedium">
            Tamanho:
          </Typography>
          <Typography variant="footnote1">{directoryInfo.totalSize}</Typography>
        </div>
      </div>
    </main>
  );
};

export default DirectoryInfoJob;
