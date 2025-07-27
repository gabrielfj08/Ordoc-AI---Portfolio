import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const DirectoryInfoJobSkeleton = () => {
  return (
    <main className="h-full max-w-full p-4 sm:p-6 -mt-8">
      <div className="sm:flex block pb-3">
        <div className="rounded-lg w-full sm:max-h-32 sm:h-20 h-16 items-center flex bg-lightGray pl-2 ml-0 sm:mr-2 sm:mb-0 mb-3">
          <Icon
            name="folderOutlined"
            alt="folderOutlined"
            stroke
            w={26}
            h={26}
          />
          <div className="grid justify-left items-center w-full h-full pl-3 mr-4 -space-y-6">
            <Typography
              variant="footnote1"
              family="robotoMedium"
              className="pb-2"
            >
              N° de pastas:
            </Typography>
            <Icon
              alt="air"
              name="air"
              w={28}
              h={28}
              stroke
              className="animate-spin"
            />
          </div>
        </div>
        <div className="rounded-lg w-full sm:max-h-32 sm:h-20 h-16 items-center flex bg-lightGray pl-2 ml-0">
          <Icon name="pdfFileV2" alt="pdfFileV2" fill w={26} h={26} />
          <div className="grid justify-left items-center w-full h-full pl-3 mr-4 -space-y-4">
            <Typography
              variant="footnote1"
              family="robotoMedium"
              className="pb-2"
            >
              N° de arquivos:
            </Typography>
            <Icon
              alt="air"
              name="air"
              w={28}
              h={28}
              stroke
              className="animate-spin"
            />
          </div>
        </div>
      </div>
      <div className="rounded-lg w-full sm:max-h-32 sm:h-20 h-16 items-center flex bg-lightGray pl-2 ml-0 sm:mr-1.5">
        <Icon name="storage" alt="storage" fill w={26} h={26} />
        <div className="grid justify-left items-center w-full h-full pl-3 mr-2 -space-y-8">
          <Typography
            variant="footnote1"
            family="robotoMedium"
            className="pb-2"
          >
            Tamanho:
          </Typography>
          <Icon
            alt="air"
            name="air"
            w={28}
            h={28}
            stroke
            className="animate-spin"
          />
        </div>
      </div>
    </main>
  );
};

export default DirectoryInfoJobSkeleton;
