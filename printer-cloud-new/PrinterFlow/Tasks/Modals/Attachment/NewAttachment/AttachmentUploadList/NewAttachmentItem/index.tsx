import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../../../hooks';
import { TaskDocumentService } from '../../../../../../../services/printer-flow';
import { NewTaskAttachmentItemContainerProps } from './types';
import { queryClient } from '../../../../../../../queryClient';
import NewAttachmentTaskItemError from './Error';
import NewAttachmentTaskItemSkeleton from './Skeleton';
import NewTaskAttachmentItem from './NewAttachmentItem';

const NewAttachmentTaskItemContainer = ({
  taskId,
  taskDocumentUploadJobId,
}: NewTaskAttachmentItemContainerProps) => {
  const { token, subdomain } = useAuth();
  const [itemVisibility, setItemVisibility] = React.useState<boolean>(true);

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'documentTask',
      token,
      subdomain,
      taskId,
      taskDocumentUploadJobId,
    ],
    queryFn: () =>
      TaskDocumentService.show(
        token,
        subdomain,
        taskId,
        taskDocumentUploadJobId
      ),
    refetchInterval: (data) =>
      data?.status === 'finished' || data?.status === 'failed' ? false : 50,
    onSuccess: (data) => {
      data?.status === 'finished' && setItemVisibility(false);
      setTimeout(() => {
        queryClient.invalidateQueries([
          'taskDocuments',
          token,
          subdomain,
          taskId,
        ]);
      }, 1000);
    },
  });

  if (isError)
    return <NewAttachmentTaskItemError itemVisibility={itemVisibility} />;

  if (isLoading) return <NewAttachmentTaskItemSkeleton />;

  return (
    <NewTaskAttachmentItem
      taskDocument={data}
      itemVisibility={itemVisibility}
      setItemVisibility={setItemVisibility}
    />
  );
};

export default NewAttachmentTaskItemContainer;
