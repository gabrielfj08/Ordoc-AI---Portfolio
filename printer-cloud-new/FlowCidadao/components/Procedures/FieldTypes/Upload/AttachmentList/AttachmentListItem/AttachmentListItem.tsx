import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { removeFileExtension } from '../../../../../../../utils';
import { UploadProcedureAttachmentUploadListItemProps } from './types';
import UploadStatusIcon from '../../../../../UploadStatusIcon';

const UploadProcedureAttachmentUploadListItem = ({
  item,
  color,
  onClose,
  itemVisibility,
}: UploadProcedureAttachmentUploadListItemProps) => {
  return (
    <div
      className={`flex items-center rounded-lg bg-lighterGray h-10 px-4 w-full justify-between gap-2 ${
        itemVisibility ? 'flex' : 'hidden'
      }`}
    >
      <div className="flex gap-2 items-center truncate">
        <Typography
          className="truncate"
          variant="bodySm"
          family="jakartaBold"
          color={color}
        >
          {removeFileExtension(item.name)}
        </Typography>
      </div>
      <div className="flex gap-1 items-center">
        <UploadStatusIcon status={item.status} color={color} />
        <button type="button" onClick={onClose}>
          <Icon name="closeV3" alt="close" stroke color={color} h={16} w={16} />
        </button>
      </div>
    </div>
  );
};

export default UploadProcedureAttachmentUploadListItem;
