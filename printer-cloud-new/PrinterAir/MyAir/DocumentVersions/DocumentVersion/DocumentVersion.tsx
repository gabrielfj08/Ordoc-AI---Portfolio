import * as React from 'react';
import { Icon, Paper, Typography } from 'printer-ui';
import { useSnackbar, useSession, useAuth } from '../../../../hooks';
import { queryClient } from '../../../../queryClient';
import { DocumentVersionProps } from './types';
import { menuOptions } from '../../../components/MenuButton/types';
import MenuButton from '../../../components/MenuButton/MenuButton';

const DocumentVersion = ({
  documentVersion,
  title,
  total,
  onDownload,
  onDelete,
}: DocumentVersionProps) => {
  const { showSnackbar } = useSnackbar();
  const { session } = useSession();
  const { token } = useAuth();

  if (total <= 1) {
    const options: menuOptions[] = [
      {
        icon: 'downloadV2',
        fill: true,
        onClick: onDownload,
        label: 'Download',
        stroke: false,
      },
    ];

    return (
      <Paper h={32} w="full" color="lighterGray" className="pl-1">
        <div className="flex p-2">
          <Typography variant="headline" family="robotoMedium">
            {title}
          </Typography>
        </div>
        <div className="flex p-1 items-center justify-between">
          <div className="flex items-center">
            <Icon alt="teste" name="pdfFileV2" fill />
            <Typography variant="headline" className="pl-1">
              {documentVersion.originalFilename}
            </Typography>
          </div>
          <div className="">
            <MenuButton options={options} />
          </div>
        </div>
        <div className="flex p-2">
          <Typography variant="headline" className="pr-2">
            Data:{' '}
            {new Intl.DateTimeFormat('pt-BR', {
              dateStyle: 'short',
              timeStyle: 'medium',
            }).format(new Date(documentVersion.createdAt))}
          </Typography>
        </div>
      </Paper>
    );
  }

  const options: menuOptions[] = [
    {
      icon: 'downloadV2',
      fill: true,
      onClick: onDownload,
      label: 'Download',
      stroke: false,
    },
    {
      icon: 'trash',
      fill: true,
      onClick: () => {
        // TODO: USE useMutation TO INVALIDATE DOCUMENT VERSIONS QUERY
        onDelete()
          .then(() => {
            showSnackbar('Versão deletada com sucesso', 'success');
            queryClient.invalidateQueries([
              'documentVersions',
              { organizationId: session.organization?.id, token },
            ]);
          })
          .catch((error) => {
            showSnackbar(error.response.data.message, 'error');
          });
      },
      label: 'Remover',
      stroke: true,
    },
  ];

  return (
    <Paper h={32} w="full" color="lighterGray" className="pl-1">
      <div className="flex p-2">
        <Typography variant="headline" family="robotoMedium">
          {title}
        </Typography>
      </div>
      <div className="flex p-1 items-center justify-between">
        <div className="flex items-center">
          <Icon alt="teste" name="pdfFileV2" fill />
          <Typography variant="headline" className="pl-1">
            {documentVersion.originalFilename}
          </Typography>
        </div>
        <div className="">
          <MenuButton options={options} />
        </div>
      </div>
      <div className="flex p-2">
        <Typography variant="headline" className="pr-2">
          Data:{' '}
          {new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'medium',
          }).format(new Date(documentVersion.createdAt))}
        </Typography>
      </div>
    </Paper>
  );
};

export default DocumentVersion;
