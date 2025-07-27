import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  useAuth,
  useExternalAuth,
  useExternalSession,
  useSession,
} from '../../../../../hooks';
import { ExternalTaskDocumentService } from '../../../../../services/flow-cidadao/TaskDocument';
import { AttachmentExternalTaskListContainerProps } from './types';
import AttachmentExternalTaskListSkeleton from './Skeleton';
import TaskAttachmentList from './AttachmentTaskList';
import AttachmentExternalTaskListError from './Error';
import TaskExternalAttachmentListEmpty from './Empty';

const AttachmentExternalTaskListContainer = ({
  task,
}: AttachmentExternalTaskListContainerProps) => {
  const { subdomain } = useAuth();
  const { session } = useSession();
  const { externalToken } = useExternalAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['indexInternalListDocument', externalToken, subdomain, task.id],
    queryFn: () =>
      ExternalTaskDocumentService.index(String(externalToken), subdomain, {
        order: 'created_at',
        direction: 'asc',
        taskId: task.id,
        perPage: 1000,
      }),
  });

  if (isLoading) return <AttachmentExternalTaskListSkeleton />;

  if (isError) return <AttachmentExternalTaskListError />;

  if (!data.meta.total) return <TaskExternalAttachmentListEmpty />;

  return (
    <>
      {task.createdBy.id === session.externalUserId &&
      data.taskDocuments.length === 0 ? (
        <TaskExternalAttachmentListEmpty />
      ) : (
        <TaskAttachmentList taskDocuments={data.taskDocuments} task={task} />
      )}
    </>
  );
};

export default AttachmentExternalTaskListContainer;
