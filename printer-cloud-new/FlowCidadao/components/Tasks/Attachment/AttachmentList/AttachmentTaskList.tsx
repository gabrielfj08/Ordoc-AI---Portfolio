import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../../../hooks';
import { AttachmentTaskListProps } from './types';
import TaskExternalAttachmentItem from '../AttachmentItem';

const AttachmentExternalTaskList = ({
  taskDocuments,
  task,
}: AttachmentTaskListProps) => {
  const { themeColor } = useSession();
  return (
    <div
      className={`w-full min-h-16 max-h-32 overflow-x-auto px-4 py-2 border border-${themeColor} rounded-lg space-y-1 mb-4`}
    >
      <Typography
        variant="bodyMd"
        family="jakartaBold"
        color={themeColor}
        align="start"
      >
        Meus anexos:
      </Typography>
      <div className="grid sm:grid-cols-3 pb-2 gap-2">
        {taskDocuments.map((taskDocument) => (
          <TaskExternalAttachmentItem
            task={task}
            key={taskDocument.id}
            taskDocument={taskDocument}
          />
        ))}
      </div>
    </div>
  );
};

export default AttachmentExternalTaskList;
