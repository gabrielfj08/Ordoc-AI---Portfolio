import * as React from 'react';
import getConfig from 'next/config';
import { Typography } from 'printer-ui';

const ShowDocumentTemplate = ({ link, name }) => {
  const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

  return (
    <div className="flex space-x-2">
      {link ? (
        <>
          <Typography variant="footnote2">Modelo de anexo: </Typography>
          <div
            className="cursor-pointer"
            onClick={() =>
              window.document.open(`${apiUrl}/${link}`, '_blank', 'noreferrer')
            }
          >
            <Typography variant="footnote2" color="info" className="underline">
              {name}
            </Typography>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ShowDocumentTemplate;
