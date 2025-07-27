import * as React from 'react';
import { Skeleton, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../hooks';

const ProcedureInfoPreviewSkeleton = () => {
  const { themeColor } = useSession();

  return (
    <div className="sm:pt-6 pt-2 w-full">
      <Typography family="jakartaBold" variant="bodyLg" color={themeColor}>
        Prévia do processo
      </Typography>
      <div className={`border-y-2 border-${themeColor} my-2 py-2 space-y-1`}>
        <div className="flex items-center space-x-2">
          <Typography
            variant="bodyLg"
            family="jakartaBold"
            color={themeColor}
            align="start"
          >
            Solicitante
          </Typography>
          <div className="w-4/12">
            <Skeleton w="full" h={4} rounded="lg" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Typography
            variant="bodyLg"
            family="jakartaBold"
            color={themeColor}
            align="start"
          >
            Tipo de processo
          </Typography>
          <div className="w-3/12">
            <Skeleton w="full" h={4} rounded="lg" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Typography
            variant="bodyLg"
            family="jakartaBold"
            color={themeColor}
            align="start"
          >
            Assunto do processo
          </Typography>
          <div className="w-3/12">
            <Skeleton w="full" h={4} rounded="lg" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Typography
            variant="bodyLg"
            family="jakartaBold"
            color={themeColor}
            align="start"
          >
            Grupo responsável
          </Typography>
          <div className="w-3/12">
            <Skeleton w="full" h={4} rounded="lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcedureInfoPreviewSkeleton;
