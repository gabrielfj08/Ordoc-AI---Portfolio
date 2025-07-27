import * as React from 'react';
import getConfig from 'next/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { useAws, useSnackbar } from '../../../../../hooks';
import { AvatarContainerProps } from '../../AvatarButton/types';
import Avatar from './Avatar';

const appEnv = getConfig().publicRuntimeConfig.NEXT_PUBLIC_APP_ENV;

const AvatarContainer = ({ user, onSubmit }: AvatarContainerProps) => {
  const { credentials } = useAws();
  const { showSnackbar } = useSnackbar();

  const handleSubmit = (avatarFile: File) => {
    const s3Client = new S3Client({
      region: 'sa-east-1',
      credentials,
    });

    const params = {
      Bucket: 'printer-cloud-assets',
      Key: `${appEnv}/avatar/${user.id}/${avatarFile.name}`,
      Body: avatarFile,
    };

    const command = new PutObjectCommand(params);

    s3Client
      .send(command)
      .then(() => {
        onSubmit(
          `https://printer-cloud-assets.s3.sa-east-1.amazonaws.com/${appEnv}/avatar/${user.id}/${avatarFile.name}`
        );
      })
      .catch(() => {
        showSnackbar('Erro ao fazer upload de imagem', 'error');
      });
  };

  return <Avatar onSubmit={handleSubmit} user={user} />;
};

export default AvatarContainer;
