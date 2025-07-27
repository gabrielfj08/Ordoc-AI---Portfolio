import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../hooks';
import ProcedureInfoPreviewError from '../NewProcedure/ProcedureInfoPreview/Error';

const ReviewProceduresError = () => {
  const { themeColor } = useSession();

  return (
    <div className="sm:pr-10 sm:pl-20 px-4">
      <Typography family="jakartaBold" variant="bodyLg" color={themeColor}>
        Prévia do processo:
      </Typography>
      <ProcedureInfoPreviewError />
      <Typography family="jakartaBold" variant="bodyLg" color={themeColor}>
        Preencha os campos do processo:
      </Typography>
      <div
        className={`border rounded-lg border-${themeColor} my-4 flex items-center space-x-2 justify-center py-7`}
      >
        <Icon alt="alert" name="alert" color="error" stroke className="ml-4" />
        <Typography
          family="jakartaBold"
          variant="bodyMd"
          color="error"
          align="center"
        >
          Erro! Não foi possível carregar os campos do processo para
          preenchimento, tente novamente mais tarde.
        </Typography>
      </div>
    </div>
  );
};

export default ReviewProceduresError;
