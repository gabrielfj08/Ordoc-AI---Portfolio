import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { removeFileExtension } from '../../../../../../../utils';
import { AttachmentUploadListItemProps } from './types';
import UploadDocumentStatusIcon from '../../../../../ProcedureTemplates/StatusIcon/StatusIcon';

const AttachmentUploadListItem = ({
  item,
  onClose,
  itemVisibility,
}: AttachmentUploadListItemProps) => {
  return (
    <div
      className={`gap-2 items-center rounded-md bg-lighterGray h-12 p-5 w-full justify-between ${
        itemVisibility ? 'flex' : 'hidden'
      }`}
    >
      <div className="flex gap-2 items-center truncate">
        <Icon name="fileV2" color="black" alt="status" fill />
        <Typography className="truncate" variant="footnote1">
          {removeFileExtension(item.name)}
        </Typography>
      </div>
      <div className="flex gap-2 items-center">
        <UploadDocumentStatusIcon status={item.status} />
        <button type="button" onClick={onClose}>
          <Icon name="close" color="black" alt="close" stroke />
        </button>
      </div>
    </div>
  );
};

export default AttachmentUploadListItem;
