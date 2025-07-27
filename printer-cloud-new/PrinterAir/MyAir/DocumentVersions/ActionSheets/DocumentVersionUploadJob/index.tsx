import * as React from 'react';
import getConfig from 'next/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { useQueryClient } from '@tanstack/react-query';
import {
  useAuth,
  useAws,
  useSession,
  useSnackbar,
  useActionSheet,
} from '../../../../../hooks';
import { DocumentVersionUploadJobService } from '../../../../../services/printer-air';
import { DocumentVersionUploadJobActionSheetContainerProps } from './types';
import DocumentVersionUploadJobActionSheet from './DocumentVersionUploadJob';

const appEnv = getConfig().publicRuntimeConfig.NEXT_PUBLIC_APP_ENV;

const DocumentVersionUploadJobActionSheetContainer = ({
  document,
  description,
  location,
  file,
}: DocumentVersionUploadJobActionSheetContainerProps) => {
  const { token, subdomain } = useAuth();
  const { session } = useSession();
  const { credentials } = useAws();
  const { showSnackbar } = useSnackbar();
  const { closeActionSheet } = useActionSheet();
  const queryClient = useQueryClient();

  const [documentVersionUploadJobId, setDocumentVersionUploadJobId] =
    React.useState<number | null>(null);

  React.useEffect(() => {
    const s3Client = new S3Client({
      region: 'sa-east-1',
      credentials,
    });

    const key = `${appEnv}/${session.organization?.cnpj}${session.directory?.path}/${file.name}`;

    const params = {
      Bucket: 'printer-air-document-upload',
      Key: key,
      Body: file,
      ContentType: file.type,
    };

    const command = new PutObjectCommand(params);

    s3Client.send(command).then(() => {
      DocumentVersionUploadJobService.create(token, subdomain, document.id, {
        s3Key: key,
        description: description,
        location: location,
      })
        .then((documentVersionUploadJob) => {
          setDocumentVersionUploadJobId(documentVersionUploadJob.id);
          queryClient.invalidateQueries(['documents', {}]);
        })
        .catch((error) => {
          closeActionSheet();
          showSnackbar(error.response.data.message, 'error');
        });
    });
  }, [document, description, location, file]);

  if (documentVersionUploadJobId) {
    return (
      <DocumentVersionUploadJobActionSheet
        documentVersionUploadJobId={documentVersionUploadJobId}
      />
    );
  }

  return null;
};

export default DocumentVersionUploadJobActionSheetContainer;
