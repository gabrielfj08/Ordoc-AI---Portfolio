import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../../queryClient';
import {
  useAuth,
  useExternalAuth,
  useV3Snackbar,
  useSession,
} from '../../../../../hooks';
import { ExternalTaskDocumentService } from '../../../../../services/flow-cidadao';
import { AttachmentTaskItemContainerProps } from './types';
import TaskExternalAttachmentItem from './AttachmentTaskItem';
import AttachmentTaskItemError from './Error';

const TaskExternalAttachmentItemContainer = ({
  task,
  taskDocument,
}: AttachmentTaskItemContainerProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();
  const { session } = useSession();
  const { showV3Snackbar } = useV3Snackbar();

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

  const handleSubmit = () => {
    ExternalTaskDocumentService.deleteTaskDocument(
      String(externalToken),
      subdomain,
      taskDocument.taskId,
      taskDocument.id
    )
      .then(() => {
        queryClient.invalidateQueries([]);
        queryClient.invalidateQueries([
          'showListDocuments',
          externalToken,
          subdomain,
          taskDocument.taskId,
        ]),
          [
            'documentExternalTask',
            externalToken,
            subdomain,
            taskDocument.taskId,
          ];
        showV3Snackbar(`Anexo removido com sucesso.`, 'success', 'Sucesso!');
      })
      .catch((error) => {
        showV3Snackbar(
          error.response.data.message,
          'error',
          'Algo deu errado!'
        );
      });
  };

  return (
    <>
      {taskDocument.createdBy.id === session.externalUserId ? (
        <TaskExternalAttachmentItem
          task={task}
          handleSubmit={handleSubmit}
          taskDocument={data}
        />
      ) : null}
    </>
  );
};

export default TaskExternalAttachmentItemContainer;
