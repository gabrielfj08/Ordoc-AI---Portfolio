import * as React from 'react';
import { Skeleton, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../hooks';
import ProcedureInfoPreviewSkeleton from '../NewProcedure/ProcedureInfoPreview/Skeleton';

const NewFieldsPreviewSkeleton = () => {
  const { themeColor } = useSession();

  return (
    <div className="space-y-6 pb-6 h-fit sm:pr-10 sm:pl-20 px-4">
      <ProcedureInfoPreviewSkeleton />
      <Typography family="jakartaBold" variant="bodyLg" color={themeColor}>
        Preencha os campos do processo:
      </Typography>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <Skeleton h={4} w={36} rounded="lg" />
          <Skeleton h={12} w="full" rounded="lg" />
        </div>
        <div className="space-y-3">
          <Skeleton h={4} w={32} rounded="lg" />
          <Skeleton h={12} w="full" rounded="lg" />
        </div>
        <div className="space-y-3">
          <Skeleton h={4} w={44} rounded="lg" />
          <Skeleton h={12} w="full" rounded="lg" />
        </div>
        <div className="space-y-3">
          <Skeleton h={4} w={24} rounded="lg" />
          <Skeleton h={12} w="full" rounded="lg" />
        </div>
        <div className="space-y-3">
          <Skeleton h={4} w={28} rounded="lg" />
          <Skeleton h={12} w="full" rounded="lg" />
        </div>
        <div className="space-y-3">
          <Skeleton h={4} w={40} rounded="lg" />
          <Skeleton h={12} w="full" rounded="lg" />
        </div>
      </div>
    </div>
  );
};

export default NewFieldsPreviewSkeleton;
