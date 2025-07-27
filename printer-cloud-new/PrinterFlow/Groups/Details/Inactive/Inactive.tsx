import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { InactiveGroupDetailsProps } from './types';

const InactiveGroupDetails = ({
  justificationNote,
}: InactiveGroupDetailsProps) => {
  const boxClassName =
    'w-full h-fit bg-lighterGray py-5 px-3.5 rounded-lg border border-lightGray flex space-x-2.5 items-center shadow-default';
  return (
    <>
      <div className={boxClassName}>
        <Icon name="user" alt="requesterGroup" stroke w={26} h={26} />
        <div className="space-y-2">
          <Typography variant="footnote1" family="robotoMedium">
            Desativado por:
          </Typography>
          <Typography variant="footnote1">
            {justificationNote.createdBy.name}
          </Typography>
        </div>
      </div>

      <div className={boxClassName}>
        <Icon name="calendarV2" alt="requesterGroup" stroke w={26} h={26} />
        <div className="space-y-2">
          <Typography variant="footnote1" family="robotoMedium">
            Data da desativação:
          </Typography>
          <Typography variant="footnote1">
            {new Intl.DateTimeFormat('pt-BR', {
              dateStyle: 'short',
              timeStyle: 'medium',
            }).format(new Date(justificationNote.createdAt))}
          </Typography>
        </div>
      </div>

      <div className={boxClassName}>
        <Icon name="write" alt="requesterGroup" stroke fill w={26} h={26} />
        <div className="space-y-2">
          <Typography variant="footnote1" family="robotoMedium">
            Justificativa:
          </Typography>
          <Typography variant="footnote1">{justificationNote.note}</Typography>
        </div>
      </div>
    </>
  );
};

export default InactiveGroupDetails;
