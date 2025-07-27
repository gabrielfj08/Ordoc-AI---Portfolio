import * as React from 'react';
import getConfig from 'next/config';
import { Button, Typography } from 'printer-ui';
import { getFileExtension } from '../../../../../../utils';
import { PreviewSharedDocumentContentProps } from './types';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const PreviewSharedDocumentContent = ({
  document,
}: PreviewSharedDocumentContentProps) => {
  if (document.byteSize > 500000000) {
    return (
      <div className="sm:max-w-[700px] w-[80vw] p-5">
        <Typography align="center">
          Esse arquivo é muito grande para ser visualizado.
        </Typography>
        <Typography align="center">
          Faça o download para visualizar seu conteúdo
        </Typography>
        <div className="flex justify-center align-center py-6">
          <a href={document.downloadUrl} target="_blank">
            <Button
              type="submit"
              color="blue"
              label="Download"
              disabled={false}
            >
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

  switch (getFileExtension(document.originalFilename).toLowerCase()) {
    case 'pdf':
    case 'png':
    case 'jpg':
    case 'jpeg':
      return (
        <iframe
          src={`${apiUrl}/${document.url}`}
          className="w-[80vw] h-[75vh]"
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
            <a href={document.downloadUrl} target="_blank">
              <Button
                type="submit"
                color="blue"
                label="Download"
                disabled={false}
              >
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

export default PreviewSharedDocumentContent;
