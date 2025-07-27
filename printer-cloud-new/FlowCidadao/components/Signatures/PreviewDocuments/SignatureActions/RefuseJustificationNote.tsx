import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TypographyV3 as Typography } from 'printer-ui';
import { useAuth, useExternalAuth } from '../../../../../hooks';
import { ExternalJustificationNoteService } from '../../../../../services/flow-cidadao';
import { RefuseJustificationNoteProps } from './types';

const RefuseJustificationNote = ({
  signature,
}: RefuseJustificationNoteProps) => {
  const { externalToken } = useExternalAuth();
  const { subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'signatureJustificatioNote',
      externalToken,
      subdomain,
      signature.id,
    ],
    queryFn: () =>
      ExternalJustificationNoteService.index(
        externalToken as string,
        subdomain,
        { justifiableId: signature.id, justifiableType: 'signature' }
      ),
  });

  if (isError) return null;

  if (isLoading) return null;

  return (
    <>
      {data.justificationNotes.map((justificationNote) => (
        <div key={justificationNote.id}>
          <Typography variant="label" color="gray">
            Justificativa
          </Typography>
          <div className="border border-lightGray w-full max-h-16 overflow-y-auto p-4 rounded-lg">
            <Typography variant="bodyMd" color="gray">
              {justificationNote.note}
            </Typography>
          </div>
        </div>
      ))}
    </>
  );
};

export default RefuseJustificationNote;
