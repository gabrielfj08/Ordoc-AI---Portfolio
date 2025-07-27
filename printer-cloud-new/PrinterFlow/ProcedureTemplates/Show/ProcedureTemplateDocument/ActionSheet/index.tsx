import * as React from 'react';
import router from 'next/router';
import getConfig from 'next/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {
  useAws,
  useAuth,
  useSession,
  useSnackbar,
  useActionSheet,
} from '../../../../../hooks';
import { ProcedureTemplateDocumentService } from '../../../../../services/printer-flow';
import { CreateProcedureTemplateDocumentAPIResponse } from '../../../../../services/printer-flow/types/procedureTemplateDocument';
import { ProcedureTemplateActionSheetContainerProps } from './types';
import UploadDocumentActionSheet from './ActionSheet';

const appEnv = getConfig().publicRuntimeConfig.NEXT_PUBLIC_APP_ENV;

const ProcedureTemplateActionSheetContainer = ({
  fileList,
  procedureTemplateDocument,
  procedureTemplate,
}: ProcedureTemplateActionSheetContainerProps) => {
  const { token, subdomain } = useAuth();
  const { session } = useSession();
  const { credentials } = useAws();
  const { showSnackbar } = useSnackbar();
  const { closeActionSheet } = useActionSheet();

  const [uploadAttachmentIds, setUploadAttachmentIds] = React.useState<
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
        Key: `${appEnv}/${session.organization.cnpj}/Meu Air/Printer Flow/${procedureTemplate.name}/${file.name}`,
        Body: file,
      };

      const command = new PutObjectCommand(params);

      s3Client
        .send(command)
        .then(() => {
          ProcedureTemplateDocumentService.create(
            token,
            subdomain,
            Number(router.query.procedureTemplateId),
            {
              s3Key: `${appEnv}/${session.organization.cnpj}/Meu Air/Printer Flow/${procedureTemplate.name}/${file.name}`,
              name: `${file.name}`,
            }
          )
            .then(
              (
                procedureTemplateDocument: CreateProcedureTemplateDocumentAPIResponse
              ) => {
                setUploadAttachmentIds((prevState) => [
                  ...prevState,
                  procedureTemplateDocument.id,
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
  }, [fileList, procedureTemplate, procedureTemplateDocument]);

  if (!uploadAttachmentIds) return null;

  return <UploadDocumentActionSheet documentUploadIds={uploadAttachmentIds} />;
};

export default ProcedureTemplateActionSheetContainer;
