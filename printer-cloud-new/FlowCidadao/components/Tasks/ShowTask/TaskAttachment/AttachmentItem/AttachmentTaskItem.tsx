import * as React from 'react';
import getConfig from 'next/config';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../../../../hooks';
import { removeFileExtension } from '../../../../../../utils';
import { AttachmentTaskItemProps } from './types';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const TaskExternalAttachmentItem = ({
  taskDocument,
}: AttachmentTaskItemProps) => {
  const { themeColor } = useSession();

  const showTaskDocument = (url) => {
    const newWindow = window.open(
      `${apiUrl}/${url}`,
      '_blank',
      'noopener,noreferrer'
    );
    if (newWindow) newWindow.opener = null;
  };

  return (
    <div
      className="flex cursor-pointer items-center rounded-lg bg-lighterGray h-10 px-4 w-full justify-between gap-2"
      onClick={() => showTaskDocument(taskDocument.documentUrl)}
    >
      <div className="flex gap-3 items-center truncate">
        <Typography
          className="truncate"
          variant="bodySm"
          family="jakartaBold"
          color={themeColor}
        >
          {removeFileExtension(taskDocument.name)}
        </Typography>
      </div>
      <Icon
        alt="ver"
        name="openedEye"
        stroke
        color={themeColor}
        w={18}
        h={18}
      />
    </div>
  );
};

export default TaskExternalAttachmentItem;
