import * as React from 'react';
import { icon, Icon } from 'printer-ui';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { SearchDocumentStatusProps } from './types';

const SearchDocumentStatus = ({ document }: SearchDocumentStatusProps) => {
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
    <>
      {document.versionId === null ? (
        <div className="hidden sm:flex items-center justify-center w-[120px] mx-auto">
          {document.shared ? (
            <div
              id={`shared${document.id}`}
              data-tooltip-content="Compartilhado"
              className="hidden sm:flex items-center justify-center w-3/12"
            >
              <Icon alt="shared" name="shared" fill color="darkGray" />
              <ReactTooltip anchorId={`shared${document.id}`} />
            </div>
          ) : (
            <div className="px-2 w-4/12" />
          )}
          <div
            id={`status${document.id}`}
            data-tooltip-content={statusTooltipMapping[document.status]}
            className="hidden sm:flex items-center justify-center w-3/12"
          >
            <Icon alt="status" name={statusIconMapping[document.status]} fill />
            <ReactTooltip anchorId={`status${document.id}`} />
          </div>
          {document.shareableLink ? (
            <div
              id={`shareableLink${document.id}`}
              data-tooltip-content="Link gerado"
              className="hidden sm:flex items-center justify-center w-3/12"
            >
              <Icon alt="link" name="link" fill />
              <ReactTooltip anchorId={`shareableLink${document.id}`} />
            </div>
          ) : (
            <div className="px-2 w-4/12" />
          )}
        </div>
      ) : (
        <div className="hidden sm:flex items-center justify-center w-16 mx-auto">
          <div
            id={`version${document.versionId}`}
            data-tooltip-content={`Versão ${document.versionId}`}
            className="hidden sm:flex items-center justify-center w-3/6"
          >
            <Icon name="versionsV2" alt="versão" fill w={25} h={25} />
            <ReactTooltip anchorId={`version${document.versionId}`} />
          </div>
          <div
            id={`status${document.id}`}
            data-tooltip-content={statusTooltipMapping[document.status]}
            className="hidden sm:flex items-center justify-center w-3/6"
          >
            <Icon alt="status" name={statusIconMapping[document.status]} fill />
            <ReactTooltip anchorId={`status${document.id}`} />
          </div>
        </div>
      )}
    </>
  );
};

export default SearchDocumentStatus;
