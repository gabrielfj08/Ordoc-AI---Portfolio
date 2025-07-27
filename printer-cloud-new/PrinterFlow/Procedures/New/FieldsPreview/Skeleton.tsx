import { Icon, Skeleton, Typography } from 'printer-ui';
import * as React from 'react';

const FieldsPreviewSkeleton = () => {
  return (
    <div className="space-y-6 pb-6 h-fit">
      <div className="flex items-center space-x-2">
        <Icon alt="info" name="info" stroke w={28} h={28} />
        <Typography variant="footnote1" family="robotoMedium">
          Ao clicar em “Continuar”, o formulário a ser preenchido será:
        </Typography>
      </div>
      <Typography family="robotoMedium" color="gray">
        Campos do Processo
      </Typography>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <Skeleton h={4} w={36} rounded="default" />
          <Skeleton h={9} w="full" rounded="default" />
        </div>
        <div className="space-y-3">
          <Skeleton h={4} w={32} rounded="default" />
          <Skeleton h={9} w="full" rounded="default" />
        </div>
        <div className="space-y-3">
          <Skeleton h={4} w={44} rounded="default" />
          <Skeleton h={9} w="full" rounded="default" />
        </div>
        <div className="space-y-3">
          <Skeleton h={4} w={24} rounded="default" />
          <Skeleton h={9} w="full" rounded="default" />
        </div>
        <div className="space-y-3">
          <Skeleton h={4} w={28} rounded="default" />
          <Skeleton h={9} w="full" rounded="default" />
        </div>
        <div className="space-y-3">
          <Skeleton h={4} w={40} rounded="default" />
          <Skeleton h={9} w="full" rounded="default" />
        </div>
      </div>
    </div>
  );
};

export default FieldsPreviewSkeleton;
