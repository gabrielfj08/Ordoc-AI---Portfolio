import * as React from 'react';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import getConfig from 'next/config';
import {
  useAuth,
  useExternalAuth,
  useAws,
  useSession,
  useV3Snackbar,
} from '../../../../../../hooks';
import { ExternalProcedureDocumentService } from '../../../../../../services/flow-cidadao';
import { CreateProcedureDocumentAPIResponse } from '../../../../../../services/printer-flow/types';
import { UploadProcedureAttachmentUploadListContainerProps } from './types';
import AttachmentList from './AttachmentList';

const appEnv = getConfig().publicRuntimeConfig.NEXT_PUBLIC_APP_ENV;

const UploadProcedureAttachmentListContainer = ({
  fieldName,
  color,
  fileList,
  procedure,
  formik,
  disabled,
  value = [],
  setAttachmentLoading,
}: UploadProcedureAttachmentUploadListContainerProps) => {
  const { externalToken } = useExternalAuth();
  const { subdomain } = useAuth();
  const { session } = useSession();
  const { credentials } = useAws();
  const { showV3Snackbar } = useV3Snackbar();
  const [procedureDocumentView, setProcedureDocumentView] =
    React.useState<Array<string>>(value);
  const [procedureDocumentUuids, setProcedureDocumentUUids] =
    React.useState<Array<string>>(value);

  React.useEffect(() => {
    formik.setFieldValue(`${fieldName}`, procedureDocumentUuids);
  }, [procedureDocumentUuids]);

  React.useEffect(() => {
    if (fileList?.length > 0) setAttachmentLoading(true);
    for (var i = 0; i < fileList?.length; i++) {
      const file = fileList.item(i) as File;

      const s3Client = new S3Client({
        region: 'sa-east-1',
        credentials,
      });

      const params = {
        Bucket: 'printer-air-document-upload',
        Key: `${appEnv}/${session.organization.cnpj}/Meu Air/Printer Flow/External/${procedure.procedureTemplateName}/${procedure.processNumber}/Anexos/${file.name}`,
        Body: file,
      };

      const command = new PutObjectCommand(params);

      s3Client
        .send(command)
        .then(() => {
          ExternalProcedureDocumentService.create(
            String(externalToken),
            subdomain,
            procedure.id,
            {
              procedureDocument: {
                name: file.name,
                s3Key: `${appEnv}/${session.organization.cnpj}/Meu Air/Printer Flow/External/${procedure.procedureTemplateName}/${procedure.processNumber}/Anexos/${file.name}`,
              },
            }
          )
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
            .catch((err) => {
              showV3Snackbar(
                err.response.data.message,
                'error',
                'Algo deu errado!'
              );
              setAttachmentLoading(false);
            });
        })
        .catch(() => {
          showV3Snackbar(
            'Um erro inesperado ocorreu, tente novamente mais tarde.',
            'error',
            'Algo deu errado!'
          );
          setAttachmentLoading(false);
        });
    }
  }, [fileList]);

  return (
    <AttachmentList
      disabled={disabled}
      fieldName={fieldName}
      formik={formik}
      color={color}
      procedureId={procedure.id}
      procedureDocumentUuids={procedureDocumentUuids}
      procedureDocumentView={procedureDocumentView}
      setProcedureDocumentUUids={setProcedureDocumentUUids}
      setProcedureDocumentView={setProcedureDocumentView}
      setAttachmentLoading={setAttachmentLoading}
    />
  );
};

export default UploadProcedureAttachmentListContainer;
