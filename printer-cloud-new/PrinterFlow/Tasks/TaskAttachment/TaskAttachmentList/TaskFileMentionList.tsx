import * as React from 'react';
import { TaskAttachmentListProps } from './types';
import TaskAttachmentItem from '../TaskAttachmentItem';

const TaskFileMentionList = ({ taskAttachments }: TaskAttachmentListProps) => {
  return (
    <div className="min-h-[46px] overflow-y-auto max-h-28 space-y-3">
      {taskAttachments.map((taskAttachment) => (
        <TaskAttachmentItem
          key={taskAttachment.id}
          taskAttachment={taskAttachment}
        />
      ))}
    </div>
  );
};

export default TaskFileMentionList;
