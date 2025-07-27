import * as React from 'react';
import { Button, Typography } from 'printer-ui';
import { getFileExtension } from '../../../../../PrinterAir/utils';
import { SignableDocumentContentProps } from './types';

const SignableDocumentContent = ({
  document,
}: SignableDocumentContentProps) => {
  switch (getFileExtension(document).toLowerCase()) {
    case 'pdf':
    case 'png':
    case 'jpg':
    case 'jpeg':
      return (
        <iframe
          src={document}
          className="w-full sm:h-[54vh] h-[55vh] rounded-md"
        />
      );
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
            <a href={document} target="_blank">
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

export default SignableDocumentContent;
