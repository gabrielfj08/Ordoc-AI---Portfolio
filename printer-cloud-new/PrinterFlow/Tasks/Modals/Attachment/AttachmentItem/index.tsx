import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useSnackbar } from '../../../../../hooks';
import { queryClient } from '../../../../../queryClient';
import { TaskDocumentService } from '../../../../../services/printer-flow';
import { AttachmentTaskItemContainerProps } from './types';
import AttachmentTaskItemSkeleton from './Skeleton';
import AttachmentTaskItemError from './Error';
import TaskAttachmentItem from './AttachmentTaskItem';

const AttachmentTaskItemContainer = ({
  taskDocument,
}: AttachmentTaskItemContainerProps) => {
  const { token, subdomain } = useAuth();
  const { showSnackbar } = useSnackbar();

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'documentTask',
      token,
      subdomain,
      taskDocument.taskId,
      taskDocument.id,
    ],
    queryFn: () =>
      TaskDocumentService.show(
        token,
        subdomain,
        taskDocument.taskId,
        taskDocument.id
      ),
  });

  if (isLoading) return <AttachmentTaskItemSkeleton />;

  if (isError) return <AttachmentTaskItemError />;

  const handleSubmit = () => {
    TaskDocumentService.deleteTaskDocument(
      token,
      subdomain,
      data.taskId,
      data.id
    )
      .then(() => {
        queryClient.invalidateQueries([
          'taskDocuments',
          token,
          subdomain,
          data.taskId,
        ]),
          showSnackbar(`Anexo removido com sucesso`, 'success');
      })
      .catch((error) => {
        showSnackbar(error.response.data.message, 'error');
      });
  };

  return <TaskAttachmentItem handleSubmit={handleSubmit} taskDocument={data} />;
};

export default AttachmentTaskItemContainer;
