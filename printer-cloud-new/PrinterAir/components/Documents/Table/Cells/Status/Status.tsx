import * as React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { icon, Icon } from 'printer-ui';
import { getFileExtension } from '../../../../../utils';
import { DocumentStatusCellProps } from './types';

const DocumentStatusCell = ({ document }: DocumentStatusCellProps) => {
  const statusIconMapping: Record<string, icon> = {
    failed: 'ocrError',
    created: 'ocr',
    enqueued: 'ocrProcess',
    processed: 'ocrSuccess',
  };

  const statusTooltipMapping: Record<string, string> = {
    failed: 'OCR Falhou',
    created: '',
    enqueued: 'OCR Processando',
    processed: 'OCR Realizado',
  };

  return (
    <div className="hidden sm:flex items-center justify-center w-[120px] mx-auto">
      {document.shared ? (
        <div
          id={`shared${document.id}`}
          data-tooltip-content="Compartilhado"
          className="hidden sm:flex items-center justify-center w-4/12"
        >
          <Icon alt="shared" name="shared" fill color="darkGray" />
          <ReactTooltip anchorId={`shared${document.id}`} />
        </div>
      ) : (
        <div className="px-2 w-4/12"></div>
      )}
      <div
        id={`status${document.id}`}
        data-tooltip-content={statusTooltipMapping[document.status]}
        className="hidden sm:flex items-center justify-center w-4/12"
      >
        <>
          <Icon alt="status" name={statusIconMapping[document.status]} fill />
          <ReactTooltip anchorId={`status${document.id}`} />
        </>
      </div>
      {document.shareableLink ? (
        <div
          id={`shareableLink${document.id}`}
          data-tooltip-content="Link gerado"
          className="hidden sm:flex items-center justify-center w-4/12"
        >
          <Icon alt="link" name="link" fill />
          <ReactTooltip anchorId={`shareableLink${document.id}`} />
        </div>
      ) : (
        <div className="px-2 w-4/12"></div>
      )}
    </div>
  );
};

export default DocumentStatusCell;
