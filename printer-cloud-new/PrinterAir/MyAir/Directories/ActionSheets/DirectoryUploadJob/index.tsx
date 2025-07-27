import * as React from 'react';
import * as JSZip from 'jszip';
import getConfig from 'next/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {
  useAuth,
  useSnackbar,
  useAws,
  useSession,
  useActionSheet,
} from '../../../../../hooks';
import { DirectoryUploadJobService } from '../../../../../services/printer-air';
import { CreateDirectoryUploadJobAPIResponse } from '../../../../../services/printer-air/types';
import { getSubdomain } from '../../../../../utils';
import { DirectoryUploadJobsContainerProps } from './types';
import DirectoryUploadJob from './DirectoryUploadJob';

const appEnv = getConfig().publicRuntimeConfig.NEXT_PUBLIC_APP_ENV;

const DirectoryUploadJobsContainer = ({
  description,
  location,
  fileList,
  parentDirectory,
  ocr,
}: DirectoryUploadJobsContainerProps) => {
  const { token } = useAuth();
  const { session } = useSession();
  const { credentials } = useAws();
  const { showSnackbar } = useSnackbar();
  const { closeActionSheet } = useActionSheet();

  const [directoryUploadJobId, setDirectoryUploadJobId] = React.useState<
    number | null
  >(null);

  React.useEffect(() => {
    var zip = new JSZip();

    for (var i = 0; i < fileList.length; i++) {
      const file = fileList.item(i) as File;

      zip.file(file.webkitRelativePath, file);
    }

    zip
      .generateAsync({ type: 'uint8array' })
      .then((content) => {
        const s3Client = new S3Client({
          region: 'sa-east-1',
          credentials,
        });

        const key = `${appEnv}/${session.organization.cnpj}${
          parentDirectory.path
        }/${fileList.item(0)?.webkitRelativePath.split('/')[0]}.zip`;

        const params = {
          Bucket: 'printer-air-directory-upload',
          Key: key,
          Body: content,
          ContentType: 'application/zip',
        };

        const command = new PutObjectCommand(params);

        s3Client
          .send(command)
          .then(() => {
            DirectoryUploadJobService.create(token, getSubdomain(), {
              s3Key: key,
              description,
              location,
              ocr,
            })
              .then(
                (
                  directoryUploadJobAPIResponse: CreateDirectoryUploadJobAPIResponse
                ) => {
                  setDirectoryUploadJobId(directoryUploadJobAPIResponse.id);
                }
              )
              .catch((err) => {
                showSnackbar(err.response.data.message, 'error');
              });
          })
          .catch(() => {
            showSnackbar(
              'Erro ao compactar arquivo. Tente novamente.',
              'error'
            );
            closeActionSheet();
          });
      })
      .catch(() => {
        showSnackbar('Erro ao compactar arquivo. Tente novamente.', 'error');
        closeActionSheet();
      });
  }, [description, location, fileList, parentDirectory, ocr]);

  return (
    <DirectoryUploadJob
      directoryName={
        (fileList.item(0) as File).webkitRelativePath.split('/')[0]
      }
      directoryUploadJobId={directoryUploadJobId}
    />
  );
};

export default DirectoryUploadJobsContainer;
