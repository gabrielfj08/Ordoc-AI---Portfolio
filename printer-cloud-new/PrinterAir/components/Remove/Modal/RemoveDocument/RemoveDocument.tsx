import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import getConfig from 'next/config';
import { RemoveDocumentProps } from './types';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const RemoveDocument = ({ documentOriginalFilename }: RemoveDocumentProps) => {
  return (
    <div className="flex items-center gap-3 rounded-md bg-lighterGray h-16 px-5">
      <Icon
        alt="pdfFile"
        name="pdfFileV2"
        fill
        w={30}
        h={30}
        color="darkGray"
        className="flex-none"
      />
      <Typography
        variant="headline"
        family="roboto"
        className="truncate flex-grow"
      >
        {documentOriginalFilename}
      </Typography>
    </div>
  );
};

export default RemoveDocument;
