import * as React from 'react';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import getConfig from 'next/config';
import {
  useAuth,
  useAws,
  useSession,
  useSnackbar,
} from '../../../../../../hooks';
import { ProcedureDocumentService } from '../../../../../../services/printer-flow';
import { CreateProcedureDocumentAPIResponse } from '../../../../../../services/printer-flow/types';
import { AttachmentUploadListContainerProps } from './types';
import AttachmentUploadList from './AttachmentUploadList';

const appEnv = getConfig().publicRuntimeConfig.NEXT_PUBLIC_APP_ENV;

const AttachmentUploadListContainer = ({
  fieldName,
  fileList,
  procedure,
  formik,
}: AttachmentUploadListContainerProps) => {
  const { token, subdomain } = useAuth();
  const { session } = useSession();
  const { credentials } = useAws();
  const { showSnackbar } = useSnackbar();
  const [procedureDocumentView, setProcedureDocumentView] = React.useState<
    Array<string>
  >([]);
  const [procedureDocumentUuids, setProcedureDocumentUUids] = React.useState<
    Array<string>
  >([]);

  React.useEffect(() => {
    formik.setFieldValue(`${fieldName}`, procedureDocumentUuids);
  }, [procedureDocumentUuids]);

  React.useEffect(() => {
    for (var i = 0; i < fileList?.length; i++) {
      const file = fileList.item(i) as File;

      const s3Client = new S3Client({
        region: 'sa-east-1',
        credentials,
      });

      const params = {
        Bucket: 'printer-air-document-upload',
        Key: `${appEnv}/${session.organization.cnpj}/Meu Air/Printer Flow/${procedure.procedureTemplateName}/${procedure.processNumber}/Anexos/${file.name}`,
        Body: file,
      };

      const command = new PutObjectCommand(params);

      s3Client
        .send(command)
        .then(() => {
          ProcedureDocumentService.create(token, subdomain, procedure.id, {
            procedureDocument: {
              name: file.name,
              s3Key: `${appEnv}/${session.organization.cnpj}/Meu Air/Printer Flow/${procedure.procedureTemplateName}/${procedure.processNumber}/Anexos/${file.name}`,
            },
          })
            .then((procedureDocument: CreateProcedureDocumentAPIResponse) => {
              setProcedureDocumentUUids((prevState) => [
                ...prevState,
                procedureDocument.uuid,
              ]);
              setProcedureDocumentView((prevState) => [
                ...prevState,
                procedureDocument.uuid,
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
      fieldName={fieldName}
      formik={formik}
      procedureId={procedure.id}
      procedureDocumentUuids={procedureDocumentUuids}
      procedureDocumentView={procedureDocumentView}
      setProcedureDocumentUUids={setProcedureDocumentUUids}
      setProcedureDocumentView={setProcedureDocumentView}
    />
  );
};

export default AttachmentUploadListContainer;
