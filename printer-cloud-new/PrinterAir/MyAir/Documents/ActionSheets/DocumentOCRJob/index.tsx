import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth, useSnackbar, useActionSheet } from '../../../../../hooks';
import { DocumentService } from '../../../../../services/printer-air';
import { getSubdomain } from '../../../../../utils';
import { DocumentOCRJobContainerProps } from './types';
import DocumentOCRJob from './DocumentOCRJob';

const DocumentOCRJobContainer = ({
  selectedDocumentIds,
}: DocumentOCRJobContainerProps) => {
  const { token } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { closeActionSheet } = useActionSheet();
  const queryClient = useQueryClient();

  const [batchOperationId, setBatchOperationId] = React.useState<number | null>(
    null
  );

  React.useEffect(() => {
    DocumentService.ocr(token, getSubdomain(), {
      ids: selectedDocumentIds,
    })
      .then((res) => {
        setBatchOperationId(res.id);
        queryClient.invalidateQueries(['documents']);
      })
      .catch((err) => {
        closeActionSheet();
        showSnackbar(err.response.data.message, 'error');
      });
  }, [selectedDocumentIds]);

  if (!batchOperationId) return null;

  return <DocumentOCRJob batchOperationId={batchOperationId} />;
};

export default DocumentOCRJobContainer;
