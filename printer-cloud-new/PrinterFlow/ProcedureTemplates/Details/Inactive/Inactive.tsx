import * as React from 'react';
import { Typography, Icon } from 'printer-ui';
import { InactiveProcedureTemplateDetailsProps } from './types';

const InactiveProcedureTemplateDetails = ({
  justificationNotes,
}: InactiveProcedureTemplateDetailsProps) => {
  const boxClassName =
    'w-full h-24 bg-lighterGray py-5 px-3.5 rounded-lg border border-lightGray flex space-x-2.5 items-center shadow-default';

  return (
    <>
      <div className={boxClassName}>
        <Icon name="user" alt="user" stroke />
        <div className="space-y-2 w-full">
          <Typography variant="footnote1" family="robotoMedium" align="center">
            Usuário que desativou o tipo de processo:
          </Typography>
          <Typography variant="footnote1" align="center">
            {justificationNotes[justificationNotes.length - 1].createdBy.name}
          </Typography>
        </div>
      </div>

      <div className={boxClassName}>
        <Icon name="clock" alt="clock" stroke />
        <div className="space-y-2 w-full">
          <Typography variant="footnote1" family="robotoMedium" align="center">
            Data de desativação:
          </Typography>
          <Typography variant="footnote1" align="center">
            {new Intl.DateTimeFormat('pt-BR', {
              dateStyle: 'short',
              timeStyle: 'medium',
            }).format(
              new Date(
                justificationNotes[justificationNotes.length - 1].createdAt
              )
            )}
          </Typography>
        </div>
      </div>

      <div className={boxClassName}>
        <Icon name="write" alt="write" fill stroke />
        <div className="space-y-2 w-full">
          <Typography variant="footnote1" family="robotoMedium" align="center">
            Justificativa de desativação:
          </Typography>
          <Typography variant="footnote1" align="center">
            {justificationNotes[justificationNotes.length - 1].note}
          </Typography>
        </div>
      </div>
    </>
  );
};

export default InactiveProcedureTemplateDetails;
