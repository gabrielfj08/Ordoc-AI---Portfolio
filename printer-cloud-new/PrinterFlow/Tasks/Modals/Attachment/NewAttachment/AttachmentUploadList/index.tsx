import * as React from 'react';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import getConfig from 'next/config';
import {
  useAuth,
  useAws,
  useSession,
  useSnackbar,
} from '../../../../../../hooks';
import { TaskDocumentService } from '../../../../../../services/printer-flow';
import { CreateTaskDocumentAPIResponse } from '../../../../../../services/printer-flow/types';
import { AttachmentUploadListContainerProps } from './types';
import AttachmentUploadList from './AttachmentUploadList';

const appEnv = getConfig().publicRuntimeConfig.NEXT_PUBLIC_APP_ENV;

const AttachmentUploadListContainer = ({
  task,
  fileList,
}: AttachmentUploadListContainerProps) => {
  const { token, subdomain } = useAuth();
  const { session } = useSession();
  const { credentials } = useAws();
  const { showSnackbar } = useSnackbar();

  const [taskDocumentUploadJobIds, setTaskDocumentUploadJobIds] =
    React.useState<Array<number>>([]);
  React.useEffect(() => {
    for (var i = 0; i < fileList?.length; i++) {
      const file = fileList.item(i) as File;

      const s3Client = new S3Client({
        region: 'sa-east-1',
        credentials,
      });

      const params = {
        Bucket: 'printer-air-document-upload',
        Key: `${appEnv}/${session.organization.cnpj}/Meu Air/Printer Flow/${task.procedure?.procedureTemplateName}/${task.procedure?.processNumber}/Tarefas/${task.name}/${file.name}`,
        Body: file,
      };

      const command = new PutObjectCommand(params);

      s3Client
        .send(command)
        .then(() => {
          TaskDocumentService.create(token, subdomain, task.id, {
            name: file.name,
            s3Key: `${appEnv}/${session.organization.cnpj}/Meu Air/Printer Flow/${task.procedure?.procedureTemplateName}/${task.procedure?.processNumber}/Tarefas/${task.name}/${file.name}`,
          })
            .then((taskDocument: CreateTaskDocumentAPIResponse) => {
              setTaskDocumentUploadJobIds((prevState) => [
                ...prevState,
                taskDocument.id,
              ]);
            })
            .catch((err) => showSnackbar(err.response.data.message, 'error'));
        })
        .catch(() => {
          showSnackbar(
            'Um erro inesperado ocorreu, tente novamente mais tarde.',
            'error'
          );
        });
    }
  }, [fileList]);

  return (
    <AttachmentUploadList
      taskId={task.id}
      taskDocumentUploadJobIds={taskDocumentUploadJobIds}
    />
  );
};

export default AttachmentUploadListContainer;
