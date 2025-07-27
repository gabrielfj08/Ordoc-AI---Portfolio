import * as React from 'react';
import { Typography } from 'printer-ui';
import { RefuseJustificationNoteProps } from './types';

const RefuseJustificationNote = ({
  justificationNote,
}: RefuseJustificationNoteProps) => {
  return (
    <>
      {justificationNote.map((justificationNote) => (
        <div key={justificationNote.id}>
          <div className="space-y-1">
            <Typography
              variant="footnote2"
              className="space-x-2"
              color="gray"
              family="robotoBold"
            >
              Assinatura recusada por:
            </Typography>
            <Typography variant="footnote2" family="roboto" color="gray">
              {justificationNote.createdBy.name}, no dia{' '}
              {new Date(
                Date.parse(justificationNote.createdAt)
              ).toLocaleDateString('pt-br')}
              {' às '}
              {new Date(
                Date.parse(justificationNote.createdAt)
              ).toLocaleTimeString('pt-br')}
              .
            </Typography>

            <Typography variant="footnote2" color="gray" family="robotoBold">
              Justificativa:
            </Typography>
            <div className="border border-lighterGray sm:w-[865px] w-[340px] max-h-16 overflow-y-auto rounded-lg">
              <Typography variant="footnote2" color="gray">
                {justificationNote.note}
              </Typography>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default RefuseJustificationNote;
