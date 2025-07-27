import * as React from 'react';
import { Icon, Typography, Skeleton } from 'printer-ui';
import { useDrawer } from '../../../hooks';

const DetailsRequesterSkeleton = () => {
  const { closeDrawer } = useDrawer();

  return (
    <div className="w-screen max-w-full h-screen px-4 sm:px-14 flex flex-col py-8 space-y-4 overflow-auto">
      <div className="flex justify-end">
        <button
          onClick={() => {
            closeDrawer();
          }}
        >
          <Icon name="close" alt="close" stroke w={35} h={35} />
        </button>
      </div>
      <div className="flex items-center justify-center space-x-2 py-4 mt-[52px]">
        <Icon alt="info" name="info" stroke w={26} h={26} />
        <Typography family="robotoMedium" variant="headline">
          Detalhes do solicitante
        </Typography>
      </div>

      <Skeleton w="full" h={24} rounded="lg" />

      <Skeleton w="full" h={24} rounded="lg" />

      <Skeleton w="full" h={24} rounded="lg" />

      <Skeleton w="full" h={24} rounded="lg" />

      <Skeleton w="full" h={24} rounded="lg" />
    </div>
  );
};

export default DetailsRequesterSkeleton;
