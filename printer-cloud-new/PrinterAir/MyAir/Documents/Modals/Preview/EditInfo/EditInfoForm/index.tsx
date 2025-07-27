import * as React from 'react';
import EditDocumentInfoForm from './EditInfoForm';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../../../../hooks';
import {
  UpdateDocumentAPIResponse,
  UpdateDocumentPayload,
} from '../../../../../../../services/printer-air/types';
import { EditDocumentInfoFormContainerProps } from './types';
import { DocumentService } from '../../../../../../../services/printer-air';
import { EditDocumentFormValues } from '../../../Edit/types';

const EditDocumentInfoFormContainer = ({
  document,
  ...otherProps
}: EditDocumentInfoFormContainerProps) => {
  const { token, subdomain } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (payload: UpdateDocumentPayload) =>
      DocumentService.update(token, subdomain, document.id, payload),
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
    <EditDocumentInfoForm
      document={document}
      onSubmit={handleSubmit}
      {...otherProps}
    />
  );
};

export default EditDocumentInfoFormContainer;
