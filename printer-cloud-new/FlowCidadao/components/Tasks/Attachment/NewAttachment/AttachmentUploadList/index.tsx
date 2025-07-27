import * as React from 'react';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import getConfig from 'next/config';
import { ExternalTaskDocumentService } from '../../../../../../services/flow-cidadao';
import { CreateExternalTaskDocumentAPIResponse } from '../../../../../../services/flow-cidadao/types';
import {
  useAuth,
  useAws,
  useExternalAuth,
  useSession,
  useV3Snackbar,
} from '../../../../../../hooks';
import { AttachmentUploadListContainerProps } from './types';
import AttachmentExternalUploadList from './AttachmentUploadList';

const appEnv = getConfig().publicRuntimeConfig.NEXT_PUBLIC_APP_ENV;

const AttachmentExternalUploadListContainer = ({
  task,
  fileList,
  value,
  formik,
  fieldName,
  setIsUploading,
}: AttachmentUploadListContainerProps) => {
  const { subdomain } = useAuth();
  const { session } = useSession();
  const { credentials } = useAws();
  const { externalToken } = useExternalAuth();
  const { showV3Snackbar } = useV3Snackbar();

  const [taskDocumentView, setTaskDocumentView] =
    React.useState<Array<number>>(value);

  const [taskDocumentIds, setTaskDocumentIds] =
    React.useState<Array<number>>(value);

  React.useEffect(() => {
    for (var i = 0; i < fileList?.length; i++) {
      const file = fileList.item(i) as File;

      const s3Client = new S3Client({
        region: 'sa-east-1',
        credentials,
      });

      const params = {
        Bucket: 'printer-air-document-upload',
        Key: `${appEnv}/${session.organization.cnpj}/Meu Air/Printer Flow - Private/Flow Cidadão/${task.procedure?.procedureTemplateName}/${task.procedure?.processNumber}/Tarefas/${task.name}/${file.name}`,
        Body: file,
      };

      const command = new PutObjectCommand(params);

      s3Client
        .send(command)
        .then(() => {
          ExternalTaskDocumentService.create(
            String(externalToken),
            subdomain,
            task.id,
            {
              taskDocument: {
                name: file.name,
                s3Key: `${appEnv}/${session.organization.cnpj}/Meu Air/Printer Flow - Private/Flow Cidadão/${task.procedure?.procedureTemplateName}/${task.procedure?.processNumber}/Tarefas/${task.name}/${file.name}`,
              },
            }
          )
            .then((taskDocument: CreateExternalTaskDocumentAPIResponse) => {
              setTaskDocumentIds((prevState) => [
                ...prevState,
                taskDocument.id,
              ]);
              setTaskDocumentView((prevState) => [
                ...prevState,
                taskDocument.id,
              ]);
            })
            .catch((err) => {
              showV3Snackbar(
                err.response.data.message,
                'error',
                'Algo deu errado!'
              );
              setIsUploading(false);
            });
        })
        .catch(() => {
          showV3Snackbar(
            'Um erro inesperado ocorreu, tente novamente mais tarde.',
            'error',
            'Algo deu errado!'
          );
        });
    }
  }, [fileList]);

  return (
    <AttachmentExternalUploadList
      taskId={task.id}
      fieldName={fieldName}
      formik={formik}
      taskDocumentIds={taskDocumentIds}
      setTaskDocumentIds={setTaskDocumentIds}
      taskDocumentView={taskDocumentView}
      setTaskDocumentView={setTaskDocumentView}
      value={value}
      setIsUploading={setIsUploading}
    />
  );
};

export default AttachmentExternalUploadListContainer;
