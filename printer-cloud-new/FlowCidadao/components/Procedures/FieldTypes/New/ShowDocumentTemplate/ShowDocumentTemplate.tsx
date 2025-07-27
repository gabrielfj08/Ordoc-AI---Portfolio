import * as React from 'react';
import getConfig from 'next/config';
import { TypographyV3 as Typography } from 'printer-ui';
import { ShowDocumentTemplateProps } from './types';

const ShowDocumentTemplate = ({
  color,
  link,
  name,
}: ShowDocumentTemplateProps) => {
  const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

  return (
    <div className="flex space-x-2">
      {link ? (
        <>
          <Typography variant="bodySm" family="jakartaBold" color="darkGray">
            Baixe o modelo padrão:
          </Typography>
          <div
            className="cursor-pointer"
            onClick={() =>
              window.document.open(`${apiUrl}/${link}`, '_blank', 'noreferrer')
            }
          >
            <Typography variant="bodySm" family="jakartaBold" color={color}>
              {name}
            </Typography>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ShowDocumentTemplate;
