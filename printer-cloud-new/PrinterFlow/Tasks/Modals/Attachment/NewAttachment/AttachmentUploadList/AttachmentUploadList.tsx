import * as React from 'react';
import { AttachmentUploadListProps } from './types';
import NewAttachmentItem from './NewAttachmentItem';

const AttachmentUploadList = ({
  taskId,
  taskDocumentUploadJobIds,
}: AttachmentUploadListProps) => {
  return (
    <div className="overflow-y-auto max-h-28 space-y-3 w-full">
      {taskDocumentUploadJobIds.map((taskDocumentUploadJobId) => (
        <NewAttachmentItem
          key={taskDocumentUploadJobId}
          taskId={taskId}
          taskDocumentUploadJobId={taskDocumentUploadJobId}
        />
      ))}
    </div>
  );
};

export default AttachmentUploadList;
