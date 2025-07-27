import * as React from 'react';
import getConfig from 'next/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {
  useAuth,
  useAws,
  useSession,
  useSnackbar,
  useActionSheet,
} from '../../../../../../hooks';
import { FieldDocumentTemplateService } from '../../../../../../services/printer-flow';
import { BaseFieldDocumentTemplate } from '../../../../../../services/printer-flow/types';
import { NewFieldDocumentTemplateContainerActionSheetProps } from './types';
import NewFieldDocumentTemplateActionSheet from './ActionSheet';

const appEnv = getConfig().publicRuntimeConfig.NEXT_PUBLIC_APP_ENV;

const NewFieldDocumentTemplateContainerActionSheet = ({
  fileList,
  name,
}: NewFieldDocumentTemplateContainerActionSheetProps) => {
  const { token, subdomain } = useAuth();
  const { session } = useSession();
  const { credentials } = useAws();
  const { showSnackbar } = useSnackbar();
  const { closeActionSheet } = useActionSheet();

  const [uploadFieldDocumentTemplateId, setUploadFieldDocumentTemplateId] =
    React.useState<number>(0);

  React.useEffect(() => {
    for (var i = 0; i < fileList.length; i++) {
      const file = fileList.item(i) as File;

      const s3Client = new S3Client({
        region: 'sa-east-1',
        credentials,
      });

      const params = {
        Bucket: 'printer-air-document-upload',
        Key: `${appEnv}/${session.organization.cnpj}/Meu Air/Printer Flow/Modelos de Anexo/${file.name}`,
        Body: file,
      };

      const command = new PutObjectCommand(params);

      s3Client
        .send(command)
        .then(() => {
          FieldDocumentTemplateService.create(token, subdomain, {
            name: name,
            s3Key: `${appEnv}/${session.organization.cnpj}/Meu Air/Printer Flow/Modelos de Anexo/${file.name}`,
          })
            .then((fieldDocumentTemplate: BaseFieldDocumentTemplate) => {
              setUploadFieldDocumentTemplateId(() => fieldDocumentTemplate.id);
            })
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
  }, [fileList, name]);

  if (!uploadFieldDocumentTemplateId) return null;

  return (
    <NewFieldDocumentTemplateActionSheet
      uploadFieldDocumentTemplateId={uploadFieldDocumentTemplateId}
    />
  );
};

export default NewFieldDocumentTemplateContainerActionSheet;
