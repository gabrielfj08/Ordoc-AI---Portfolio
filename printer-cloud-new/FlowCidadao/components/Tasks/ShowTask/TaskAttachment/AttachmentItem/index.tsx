import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth, useSession } from '../../../../../../hooks';
import { ExternalTaskDocumentService } from '../../../../../../services/flow-cidadao';
import { AttachmentTaskItemContainerProps } from './types';
import TaskExternalAttachmentItem from './AttachmentTaskItem';
import AttachmentTaskItemError from './Error';

const TaskAttachmentItemContainer = ({
  taskDocument,
}: AttachmentTaskItemContainerProps) => {
  const { subdomain } = useAuth();
  const { session } = useSession();
  const { externalToken } = useExternalAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'documentInternalTask',
      externalToken,
      subdomain,
      taskDocument.taskId,
      taskDocument.id,
    ],
    queryFn: () =>
      ExternalTaskDocumentService.show(
        String(externalToken),
        subdomain,
        taskDocument.taskId,
        taskDocument.id
      ),
  });

  if (isLoading) return null;

  if (isError) return <AttachmentTaskItemError />;

  return (
    <>
      {taskDocument.createdBy.id !== session.externalUserId ? (
        <TaskExternalAttachmentItem taskDocument={data} />
      ) : null}
    </>
  );
};

export default TaskAttachmentItemContainer;
