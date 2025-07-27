import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icon, Typography } from 'printer-ui';
import { useAuth } from '../../../../../../../hooks';
import { ProcedureDocumentService } from '../../../../../../../services/printer-flow';
import { AttachmentUploadListItemContainerProps } from './types';
import AttachmentUploadListItem from './AttachmentUploadListItem';
import AttachmentUploadListItemError from './Error';
import AttachmentUploadListItemSkeleton from './Skeleton';

const AttachmentUploadListItemContainer = ({
  fieldName,
  formik,
  procedureId,
  procedureDocumentUuid,
  procedureDocumentUuids,
  setFailedDocumentUuid,
  setRemoveItemUuid,
}: AttachmentUploadListItemContainerProps) => {
  const { token, subdomain } = useAuth();
  const [itemVisibility, setItemVisibility] = React.useState<boolean>(true);

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'procedureDocument',
      token,
      subdomain,
      procedureId,
      procedureDocumentUuid,
    ],
    queryFn: () =>
      ProcedureDocumentService.show(
        token,
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

  return (
    <div>
      <AttachmentUploadListItem
        item={data}
        itemVisibility={itemVisibility}
        onClose={() => {
          setRemoveItemUuid((prevState) => [...prevState, data.uuid]);
          setItemVisibility(false);
          ProcedureDocumentService.deleteProcedureDocument(
            token,
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

export default AttachmentUploadListItemContainer;
