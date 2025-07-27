import * as React from 'react';
import { AttachmentTaskListProps } from './types';
import AttachmentTaskItem from '../AttachmentItem';

const TaskAttachmentList = ({ taskDocuments }: AttachmentTaskListProps) => {
  return (
    <div className="min-h-[46px] overflow-y-auto max-h-28 space-y-3 cursor-pointer">
      {taskDocuments.map((taskDocument) => (
        <AttachmentTaskItem key={taskDocument.id} taskDocument={taskDocument} />
      ))}
    </div>
  );
};

export default TaskAttachmentList;
