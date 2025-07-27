import * as React from 'react';
import getConfig from 'next/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {
  useAuth,
  useAws,
  useSession,
  useSnackbar,
  useActionSheet,
} from '../../../../../hooks';
import { DocumentUploadJobService } from '../../../../../services/printer-air';
import { CreateDocumentUploadJobAPIResponse } from '../../../../../services/printer-air/types';
import { getSubdomain } from '../../../../../utils';
import { DocumentUploadJobsContainerProps } from './types';
import DocumentUploadJobs from './DocumentUploadJobs';

const appEnv = getConfig().publicRuntimeConfig.NEXT_PUBLIC_APP_ENV;

const DocumentUploadJobsContainer = ({
  description,
  location,
  fileList,
  parentDirectory,
  ocr,
}: DocumentUploadJobsContainerProps) => {
  const { token } = useAuth();
  const { session } = useSession();
  const { credentials } = useAws();
  const { showSnackbar } = useSnackbar();
  const { closeActionSheet } = useActionSheet();

  const [documentUploadJobIds, setDocumentUploadJobIds] = React.useState<
    Array<number>
  >([]);

  React.useEffect(() => {
    for (var i = 0; i < fileList.length; i++) {
      const file = fileList.item(i) as File;

      const s3Client = new S3Client({
        region: 'sa-east-1',
        credentials,
      });

      const params = {
        Bucket: 'printer-air-document-upload',
        Key: `${appEnv}/${session.organization.cnpj}${parentDirectory.path}/${file.name}`,
        Body: file,
      };

      const command = new PutObjectCommand(params);

      s3Client
        .send(command)
        .then(() => {
          DocumentUploadJobService.create(token, getSubdomain(), {
            s3Key: `${appEnv}/${session.organization.cnpj}${parentDirectory.path}/${file.name}`,
            location,
            description,
            ocr,
          })
            .then(
              (
                documentUploadJobAPIResponse: CreateDocumentUploadJobAPIResponse
              ) => {
                setDocumentUploadJobIds((prevState) => [
                  ...prevState,
                  documentUploadJobAPIResponse.id,
                ]);
              }
            )
            .catch((error) => {
              closeActionSheet();
              showSnackbar(error.response.data.message, 'error');
            });
        })
        .catch((error) => {
          closeActionSheet();
          showSnackbar(error.response.data.message, 'error');
        });
    }
  }, [description, location, fileList, parentDirectory, ocr]);

  if (!documentUploadJobIds) return null;

  return <DocumentUploadJobs documentUploadJobIds={documentUploadJobIds} />;
};

export default DocumentUploadJobsContainer;
