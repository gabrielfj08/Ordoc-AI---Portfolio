import * as React from 'react';
import getConfig from 'next/config';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { removeFileExtension } from '../../../../../utils';
import { AttachmentTaskItemProps } from './types';
import { useSession } from '../../../../../hooks';
import UploadStatusIcon from '../../../UploadStatusIcon';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const TaskExternalAttachmentItem = ({
  taskDocument,
  handleSubmit,
  task,
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
    <div className="flex cursor-pointer items-center rounded-lg bg-lighterGray h-10 px-4 w-full justify-between gap-2">
      <div
        className="flex gap-3 items-center truncate"
        onClick={() => showTaskDocument(taskDocument.documentUrl)}
      >
        <Typography
          className="truncate"
          variant="bodySm"
          family="jakartaBold"
          color={themeColor}
        >
          {removeFileExtension(taskDocument.name)}
        </Typography>
      </div>
      <div className="flex gap-1 items-center">
        <UploadStatusIcon status={taskDocument.status} color={themeColor} />
        {task.status !== 'finished' && (
          <button type="button" onClick={handleSubmit}>
            <Icon
              name="closeV3"
              alt="close"
              stroke
              color={themeColor}
              h={16}
              w={16}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskExternalAttachmentItem;
