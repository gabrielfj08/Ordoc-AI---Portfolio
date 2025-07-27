import * as React from 'react';
import { TaskAttachmentProps } from './types';
import SelectTaskAttachment from './SelectTaskAttachment';

const TaskAttachment = ({
  setMentionVisibility,
  taskStatus,
  taskId,
  procedureDocuments,
  taskDocuments,
}: TaskAttachmentProps) => {
  return (
    <SelectTaskAttachment
      taskStatus={taskStatus}
      taskId={taskId}
      procedureDocuments={procedureDocuments}
      taskDocuments={taskDocuments}
      setMentionVisibility={setMentionVisibility}
    />
  );
};

export default TaskAttachment;
