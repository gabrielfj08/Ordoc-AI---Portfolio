import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../../hooks';
import { RefuseExternalJustificationNoteProps } from './types';

const RefuseExternalJustificationNote = ({
  justificationNote,
}: RefuseExternalJustificationNoteProps) => {
  const { themeColor } = useSession();

  return (
    <div
      className={`w-full h-24 overflow-y-auto px-4 py-2 border border-${themeColor} rounded-lg space-y-1`}
    >
      <Typography
        variant="bodyMd"
        family="jakartaBold"
        color={themeColor}
        align="start"
      >
        Justificativa:
      </Typography>
      <Typography
        variant="bodySm"
        family="jakartaBold"
        color="darkGray"
        align="start"
      >
        Atualizado em {''}
        {new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
        }).format(
          new Date(
            new Date(justificationNote.updatedAt)
              .toISOString()
              .replace('.000Z', '')
          )
        )}
      </Typography>
      <Typography
        variant="bodyMd"
        family="jakarta"
        color="darkGray"
        align="start"
      >
        {justificationNote.note}
      </Typography>
    </div>
  );
};

export default RefuseExternalJustificationNote;
