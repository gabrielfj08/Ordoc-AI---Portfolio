import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { DocumentOCRProps } from './types';
import DocumentOCRStatusIcon from './StatusIcon';

const DocumentOCR = ({ status }: DocumentOCRProps) => {
  return (
    <div className="rounded-lg bg-lighterGray  justify-between my-4 px-4 flex items-center w-full h-16">
      <span className="flex items-center space-x-2 truncate mr-2">
        <Icon alt="pdfFileV2" name="pdfFileV2" fill />
        <Typography variant="headline" className="truncate">
          {status == 'running'
            ? 'OCR Processando...'
            : status == 'finished'
            ? 'OCR Realizado'
            : 'OCR Falhou'}
        </Typography>
      </span>
      <DocumentOCRStatusIcon status={status} />
    </div>
  );
};

export default DocumentOCR;
