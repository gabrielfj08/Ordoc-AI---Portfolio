import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../../../../../hooks';
import { removeFileExtension } from '../../../../../../../utils';
import { NewTaskAttachmentItemProps } from './types';
import UploadStatusIcon from '../../../../../UploadStatusIcon';

const NewExternalAttachmentItem = ({
  item,
  itemVisibility,
}: NewTaskAttachmentItemProps) => {
  const { themeColor } = useSession();

  return (
    <div
      className={`${
        itemVisibility ? 'block' : 'hidden'
      } flex justify-between items-center truncate`}
    >
      <div
        className="flex items-center bg-lighterGray rounded-lg px-4 py-2
        truncate w-full"
      >
        <div className="flex items-center space-x-2 w-full truncate">
          <Typography
            className="truncate"
            variant="bodySm"
            family="jakartaBold"
            color={themeColor}
          >
            {removeFileExtension(item.name)}
          </Typography>
        </div>
        <div className="flex gap-2 items-center">
          <UploadStatusIcon status={item.status} color={themeColor} />
        </div>
      </div>
    </div>
  );
};

export default NewExternalAttachmentItem;
