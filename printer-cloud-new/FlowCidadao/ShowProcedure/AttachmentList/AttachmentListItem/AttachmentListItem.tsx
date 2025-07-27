import * as React from 'react';
import getConfig from 'next/config';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { removeFileExtension } from '../../../../utils';
import { AttachmentListItemProps } from './types';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const AttachmentListItem = ({ item }: AttachmentListItemProps) => {
  const showProcedureDocument = (url) => {
    const newWindow = window.open(
      `${apiUrl}/${url}`,
      '_blank',
      'noopener,noreferrer'
    );
    if (newWindow) newWindow.opener = null;
  };

  return (
    <button
      className={`flex items-center rounded-lg bg-lighterGray h-10 px-4 w-full justify-between gap-2 
      }`}
      onClick={() => showProcedureDocument(item.documentUrl)}
      type="button"
    >
      <div className="flex gap-2 items-center truncate sm:w-full w-80">
        <Typography
          className="truncate"
          variant="bodySm"
          family="jakartaBold"
          color="darkGray"
        >
          {removeFileExtension(item.name)}
        </Typography>
      </div>
      <Icon
        name="openedEye"
        alt="close"
        stroke
        color="darkGray"
        h={18}
        w={18}
      />
    </button>
  );
};

export default AttachmentListItem;
