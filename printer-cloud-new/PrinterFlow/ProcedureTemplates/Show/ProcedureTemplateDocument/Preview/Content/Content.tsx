import * as React from 'react';
import { Button, Typography } from 'printer-ui';
import { getFileExtension } from '../../../../../../PrinterAir/utils';
import { ProcedureTemplateDocumentModalContentProps } from './types';

const ProcedureTemplateDocumentModalContent = ({
  src,
}: ProcedureTemplateDocumentModalContentProps) => {
  switch (getFileExtension(src).toLowerCase()) {
    case 'pdf':
    case 'png':
    case 'jpg':
    case 'jpeg':
      return <iframe src={src} className="w-[80vw] h-[75vh]" />;
    default:
      return (
        <div className="sm:max-w-[700px] w-[80vw] p-5">
          <Typography align="center">
            O arquivo não pôde ser visualizado.
          </Typography>
          <Typography align="center">
            Faça o download para visualizar seu conteúdo
          </Typography>
          <div className="flex justify-center align-center py-6">
            <a href={src} target="_blank">
              <Button type="submit" color="blue" label="Download">
                <Button.Icon
                  name="download"
                  alt="download"
                  color="white"
                  w={22}
                  h={22}
                  stroke
                />
              </Button>
            </a>
          </div>
        </div>
      );
  }
};

export default ProcedureTemplateDocumentModalContent;
