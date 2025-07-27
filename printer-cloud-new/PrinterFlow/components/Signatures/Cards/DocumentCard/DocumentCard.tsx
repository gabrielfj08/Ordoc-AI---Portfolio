import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Typography } from 'printer-ui';
import { removeFileExtension } from '../../../../../utils';
import { DocumentSignatureCardProps } from './types';
import DocumentCardMenuButton from './MenuButton';
import AssigneesList from './AssigneesList';

const DocumentSignatureCard = ({ signature }: DocumentSignatureCardProps) => {
  const documentTypeMapping: Record<string, string> = {
    'PrinterFlow::ProcedureDocument': 'Documento do processo',
    'PrinterFlow::TaskDocument': 'Documento da tarefa',
  };

  return (
    <div className="w-full rounded-2xl h-fit p-2 border bg-white border-lightGray max-w-full">
      <div className="flex w-full justify-between">
        <div className="space-y-2 w-10/12">
          <div
            id={`originalFilename-${signature.id}`}
            data-tooltip-content={removeFileExtension(signature.signable.name)}
          >
            <Typography
              variant="headline"
              family="robotoMedium"
              className="truncate"
            >
              {removeFileExtension(signature.signable.name)}
            </Typography>
            <ReactTooltip anchorId={`originalFilename-${signature.id}`} />
          </div>
          <Typography variant="footnote1">
            {documentTypeMapping[signature.signableType]}
          </Typography>
          <AssigneesList signature={signature} />
        </div>
        <div className="space-y-2 flex flex-col items-center">
          <DocumentCardMenuButton signature={signature} />
        </div>
      </div>
    </div>
  );
};

export default DocumentSignatureCard;
