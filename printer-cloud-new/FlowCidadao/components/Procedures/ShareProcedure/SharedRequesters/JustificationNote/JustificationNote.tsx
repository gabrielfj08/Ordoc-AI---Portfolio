import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';
import { RefuseJustificationNoteProps } from './types';

const RefuseJustificationNote = ({
  justificationNotes,
}: RefuseJustificationNoteProps) => {
  return (
    <div>
      {justificationNotes.map((justificatioNote) => (
        <div key={justificatioNote.id}>
          <Typography variant="label" color="gray">
            Justificativa
          </Typography>
          <div className="border border-lightGray p-4 rounded-lg">
            <Typography variant="bodyMd" color="gray">
              {justificatioNote.note}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RefuseJustificationNote;
