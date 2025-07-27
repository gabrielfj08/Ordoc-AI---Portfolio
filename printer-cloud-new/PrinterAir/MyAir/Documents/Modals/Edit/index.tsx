import * as React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { DocumentService } from '../../../../../services/printer-air';
import {
  UpdateDocumentAPIResponse,
  UpdateDocumentPayload,
} from '../../../../../services/printer-air/types';
import {
  EditDocumentFormValues,
  EditDocumentContainerModalProps,
} from './types';
import EditDocumentModal from './Edit';

const EditDocumentContainerModal = ({
  documentId,
  description,
  location,
  originalFilename,
}: EditDocumentContainerModalProps) => {
  const { token, subdomain } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (payload: UpdateDocumentPayload) =>
      DocumentService.update(token, subdomain, documentId, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['documents', {}]);
        queryClient.invalidateQueries(['recentDocuments', {}]);
      },
    }
  );

  const handleSubmit = (
    values: EditDocumentFormValues
  ): Promise<UpdateDocumentAPIResponse> => {
    return mutation.mutateAsync({ ...values });
  };

  return (
    <EditDocumentModal
      onSubmit={handleSubmit}
      description={description}
      location={location}
      originalFilename={originalFilename}
    />
  );
};

export default EditDocumentContainerModal;
