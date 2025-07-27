import * as React from 'react';
import { Skeleton, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../hooks';
import ProcedureInfoPreviewSkeleton from '../NewProcedure/ProcedureInfoPreview/Skeleton';

const ReviewProcedureSkeleton = () => {
  const { themeColor } = useSession();

  return (
    <div className="space-y-6 pb-6 h-fit sm:pr-10 sm:pl-20 px-4">
      <ProcedureInfoPreviewSkeleton />
      <div className="flex items-center justify-between">
        <Typography family="jakartaBold" variant="bodyLg" color={themeColor}>
          Revise as informações dos campos e finalize o processo:
        </Typography>
        <Skeleton h={12} w={40} rounded="lg" />
      </div>
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
      <div className={`border-t-2 border-${themeColor} my-2 py-2 space-y-1`}>
        <Skeleton h={12} w={40} rounded="lg" />
      </div>
    </div>
  );
};

export default ReviewProcedureSkeleton;
