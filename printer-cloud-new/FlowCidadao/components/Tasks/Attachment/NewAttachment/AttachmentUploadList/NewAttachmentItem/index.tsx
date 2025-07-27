import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../../../../queryClient';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { useAuth, useExternalAuth } from '../../../../../../../hooks';
import { ExternalTaskDocumentService } from '../../../../../../../services/flow-cidadao';
import { NewTaskAttachmentItemContainerProps } from './types';
import NewExternalAttachmentItem from './NewAttachmentItem';
import NewAttachmentTaskItemSkeleton from './Skeleton';
import NewAttachmentTaskItemError from './Error';

const NewExternalAttachmentItemContainer = ({
  taskDocumentId,
  setFailedDocumentId,
  setRemoveItemId,
  setIsUploading,
  taskId,
}: NewTaskAttachmentItemContainerProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();
  const [itemVisibility, setItemVisibility] = React.useState<boolean>(true);

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'documentTask',
      externalToken,
      subdomain,
      taskId,
      taskDocumentId,
    ],
    queryFn: () =>
      ExternalTaskDocumentService.show(
        String(externalToken),
        subdomain,
        taskId,
        Number(taskDocumentId)
      ),
    refetchInterval: (data) =>
      data?.status === 'finished' || data?.status === 'failed' ? false : 200,
    onSuccess: (data) => {
      if (data?.status === 'finished') {
        queryClient.invalidateQueries([
          'taskExternalDocuments',
          externalToken,
          subdomain,
          taskId,
        ]);
        setIsUploading(false);
      }
      if (data?.status === 'failed') {
        setFailedDocumentId((prevState) => [...prevState, data.id]);
        setIsUploading(false);
      }
    },
  });

  if (isError) return <NewAttachmentTaskItemError />;

  if (isLoading) return <NewAttachmentTaskItemSkeleton />;

  const handleClose = () => {
    setRemoveItemId((prevState) => [...prevState, data.id]);
    setItemVisibility(false);
    ExternalTaskDocumentService.deleteTaskDocument(
      String(externalToken),
      subdomain,
      data.taskId,
      data.id
    )
      .then(() => {})
      .catch(() => {});
  };

  return (
    <>
      <NewExternalAttachmentItem
        item={data}
        itemVisibility={itemVisibility}
        onClose={handleClose}
      />
      {data.status === 'failed' && itemVisibility && (
        <div className="flex items-center gap-1">
          <Icon alt="alert" name="alert" stroke color="error" w={20} h={20} />
          <Typography variant="bodyMd" family="jakarta" color="error">
            O arquivo acima não será anexado devido a um erro no carregamento.
          </Typography>
        </div>
      )}
    </>
  );
};

export default NewExternalAttachmentItemContainer;
