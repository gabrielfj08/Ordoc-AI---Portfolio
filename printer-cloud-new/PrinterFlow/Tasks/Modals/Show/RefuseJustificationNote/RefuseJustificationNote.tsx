import * as React from 'react';
import { Typography } from 'printer-ui';
import { RefuseJustificationNoteProps } from './types';

const RefuseJustificationNote = ({
  justificationNote,
}: RefuseJustificationNoteProps) => {
  return (
    <>
      <div className="space-y-2">
        <Typography variant="footnote1" family="robotoBold">
          Recusada por:
        </Typography>
        <Typography variant="footnote1">
          {justificationNote?.createdBy.name}
        </Typography>
      </div>
      <div className="space-y-2">
        <Typography variant="footnote1" family="robotoBold">
          Justificativa da recusa:
        </Typography>
        <Typography variant="footnote1">{justificationNote?.note}</Typography>
      </div>
    </>
  );
};

export default RefuseJustificationNote;
