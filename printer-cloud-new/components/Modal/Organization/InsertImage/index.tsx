import * as React from 'react';
import getConfig from 'next/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { useAws, useSnackbar } from '../../../../hooks';
import { InsertImageContainerProps } from './types';
import InsertImage from './InsertImage';

const appEnv = getConfig().publicRuntimeConfig.NEXT_PUBLIC_APP_ENV;

const InsertImageContainer = ({
  organization,
  onSubmit,
}: InsertImageContainerProps) => {
  const { credentials } = useAws();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = (logoFile: File) => {
    const s3Client = new S3Client({
      region: 'sa-east-1',
      credentials,
    });

    const params = {
      Bucket: 'printer-cloud-assets',
      Key: `${appEnv}/logo/${organization.id}/${logoFile.name}`,
      Body: logoFile,
    };

    const command = new PutObjectCommand(params);

    s3Client
      .send(command)
      .then(() => {
        onSubmit(
          `https://printer-cloud-assets.s3.sa-east-1.amazonaws.com/${appEnv}/logo/${organization.id}/${logoFile.name}`
        );
      })
      .catch(() => {
        showSnackbar('Erro ao fazer upload de imagem', 'error');
      });
  };

  return <InsertImage organization={organization} onSubmit={handleSubmit} />;
};

export default InsertImageContainer;
