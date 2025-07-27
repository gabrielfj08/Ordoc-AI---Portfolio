import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icon, Typography } from 'printer-ui';
import { useAuth, useExternalAuth } from '../../../../../../../hooks';
import { ExternalProcedureDocumentService } from '../../../../../../../services/flow-cidadao';
import { NewProcedureAttachmentUploadListItemContainerProps } from './types';
import AttachmentUploadListItem from './AttachmentListItem';
import AttachmentUploadListItemError from './Error';
import AttachmentUploadListItemSkeleton from './Skeleton';

const NewProcedureAttachmentUploadListItemContainer = ({
  fieldName,
  formik,
  color,
  procedureId,
  disabled,
  procedureDocumentUuid,
  procedureDocumentUuids,
  setFailedDocumentUuid,
  setRemoveItemUuid,
  setAttachmentLoading,
}: NewProcedureAttachmentUploadListItemContainerProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();
  const [itemVisibility, setItemVisibility] = React.useState<boolean>(true);

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'procedureDocument',
      externalToken,
      subdomain,
      procedureId,
      procedureDocumentUuid,
    ],
    queryFn: () =>
      ExternalProcedureDocumentService.show(
        String(externalToken),
        subdomain,
        procedureId,
        procedureDocumentUuid
      ),
    refetchInterval: (data) =>
      data?.status === 'finished' || data?.status === 'failed' ? false : 200,
    onSuccess: (data) => {
      if (data?.status === 'finished') {
        formik.setFieldValue(`${fieldName}`, procedureDocumentUuids);
      }
      if (data?.status === 'failed') {
        setFailedDocumentUuid((prevState) => [...prevState, data.uuid]);
      }
    },
  });

  if (isError) {
    return <AttachmentUploadListItemError />;
  }

  if (isLoading) {
    return <AttachmentUploadListItemSkeleton />;
  }

  if (data.status === 'running') {
    setAttachmentLoading(true);
  } else {
    setAttachmentLoading(false);
  }

  return (
    <div>
      <AttachmentUploadListItem
        color={color}
        item={data}
        itemVisibility={itemVisibility}
        onClose={() => {
          setRemoveItemUuid((prevState) => [...prevState, data.uuid]);
          setItemVisibility(false);
          ExternalProcedureDocumentService.deleteDocument(
            String(externalToken),
            subdomain,
            data.procedureId,
            data.id
          )
            .then((res) => {})
            .catch((err) => {});
        }}
      />
      {data.status === 'failed' && itemVisibility && (
        <div className="flex items-center gap-1">
          <Icon alt="alert" name="alert" stroke color="error" w={20} h={20} />

          <Typography variant="footnote2" color="error">
            O arquivo acima não será anexado devido a um erro no carregamento.
          </Typography>
        </div>
      )}
    </div>
  );
};

export default NewProcedureAttachmentUploadListItemContainer;
