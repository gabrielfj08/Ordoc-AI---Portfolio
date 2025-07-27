import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useActionSheet, useAuth, useSession } from '../../../../../hooks';
import { DocumentService } from '../../../../../services/printer-air';
import {
  SharedModalContainerProps,
  ShareDocumentModalFormValues,
} from './types';
import ShareDocumentModal from './Share';
import DocumentShareJob from '../../ActionSheets/DocumentShareJob';

const SharedDocumentModalContainer = ({
  document,
}: SharedModalContainerProps) => {
  const { token, subdomain } = useAuth();
  const { session } = useSession();
  const { openActionSheet } = useActionSheet();

  const mutation = useMutation(
    (values: ShareDocumentModalFormValues) =>
      DocumentService.share(token, subdomain, session.organization.id, {
        ids: [document.id],
        payload: {
          userId: values.userId,
        },
      }),
    {
      onSuccess: (values) => {
        openActionSheet(<DocumentShareJob batchOperationJob={values} />);
      },
    }
  );

  const handleSubmit = (values: ShareDocumentModalFormValues) => {
    return mutation.mutateAsync(values);
  };

  return <ShareDocumentModal document={document} onSubmit={handleSubmit} />;
};

export default SharedDocumentModalContainer;
