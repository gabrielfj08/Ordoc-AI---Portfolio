import * as React from 'react';
import getConfig from 'next/config';
import { Icon, Typography } from 'printer-ui';
import { removeFileExtension } from '../../../../../../utils';
import { AttachmentListItemProps } from '../types';

const AttachmentListItem = ({ item }: AttachmentListItemProps) => {
  const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;
  return (
    <div
      className="w-full flex truncate"
      onClick={() =>
        window.document.open(
          `${apiUrl}/${item.documentUrl}`,
          '_blank',
          'noreferrer'
        )
      }
    >
      <div
        className="flex items-center bg-lighterGray rounded-lg px-4 py-2
       justify-between truncate w-full"
      >
        <div className="flex items-center space-x-2 w-full truncate">
          <Icon name="fileV2" alt="file" fill w={30} h={30} />

          <Typography variant="footnote1" className="w-full truncate">
            {removeFileExtension(item.name)}
          </Typography>
        </div>
        <Icon name="eye" alt="eye" w={30} h={30} fill />
      </div>
    </div>
  );
};

export default AttachmentListItem;
