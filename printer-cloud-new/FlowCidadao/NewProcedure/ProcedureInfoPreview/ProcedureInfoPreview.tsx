import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';
import { useExternalSession, useSession } from '../../../hooks';
import { ProcedurePreviewProps } from './types';
import Info from '../../components/Procedures/Info';

const ProcedureInfoPreview = ({
  subject,
  procedureTemplate,
}: ProcedurePreviewProps) => {
  const { themeColor } = useSession();
  const { externalSession } = useExternalSession();

  return (
    <div className="sm:pt-6 pt-2">
      <Typography family="jakartaBold" variant="headline4" color={themeColor}>
        Prévia do processo
      </Typography>
      <div className={`border-y-2 border-${themeColor} my-2 py-2 space-y-1`}>
        <Info
          color={themeColor}
          title="Solicitante:"
          content={externalSession.user.name}
        />
        <Info
          color={themeColor}
          title="Tipo de processo:"
          content={procedureTemplate.name}
        />
        <Info
          color={themeColor}
          title="Assunto do processo:"
          content={subject.name}
        />
        <Info
          color={themeColor}
          title="Grupo responsável:"
          content={subject.groupRequester?.name}
        />
      </div>
    </div>
  );
};

export default ProcedureInfoPreview;
