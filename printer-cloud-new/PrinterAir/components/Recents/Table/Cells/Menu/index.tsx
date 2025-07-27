import * as React from 'react';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import {
  useAuth,
  useDrawer,
  useModal,
  useSession,
  useSnackbar,
} from '../../../../../../hooks';
import { DocumentService } from '../../../../../../services/printer-air';
import { MenuCellContainerProps } from './types';
import { menuOptions } from '../../../../MenuButton/types';
import EditDocumentModal from '../../../../../MyAir/Documents/Modals/Edit';
import DocumentProperties from '../../../../../MyAir/Documents/Properties';
import DocumentVersionModal from '../../../../../MyAir/DocumentVersions/Modals/Upload';
import ShareableLinksModal from '../../../../../MyAir/ShareableLinks/Modals';
import MenuCell from './Menu';
import ShareModal from '../../../../../MyAir/Documents/Modals/Share';
import RemoveItemsModal from '../../../../Remove/Modal';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const MenuCellContainer = ({ recentDocument }: MenuCellContainerProps) => {
  const { token, subdomain } = useAuth();
  const { openDrawer } = useDrawer();
  const { openModal } = useModal();
  const router = useRouter();
  const { session } = useSession();
  const { showSnackbar } = useSnackbar();

  const options: menuOptions[] = [
    {
      icon: 'link',
      fill: true,
      onClick: () =>
        openModal(
          <ShareableLinksModal documentId={recentDocument.documentId} />
        ),
      label: 'Gerar link',
      stroke: false,
    },
    {
      icon: 'arrow',
      fill: true,
      onClick: () => {
        DocumentService.show(token, subdomain, recentDocument.documentId)
          .then((document) => {
            window.document.open(
              `${apiUrl}/${document.url}`,
              '_blank',
              'noreferrer'
            );
          })
          .catch((error) => {
            showSnackbar(error.response.data.message, 'error');
          });
      },
      label: 'Abrir em uma nova guia',
      stroke: true,
    },
    {
      icon: 'shared',
      fill: true,
      onClick: () =>
        openModal(<ShareModal document={recentDocument.document} />),
      label: 'Compartilhar',
      stroke: false,
    },
    {
      icon: 'write',
      fill: true,
      onClick: () =>
        openModal(
          <EditDocumentModal
            documentId={recentDocument.documentId}
            description={recentDocument.document.description}
            location={recentDocument.document.location}
            originalFilename={recentDocument.document.originalFilename}
          />
        ),
      label: 'Editar',
      stroke: true,
    },
    {
      icon: 'versionsV2',
      fill: true,
      onClick: () =>
        openModal(<DocumentVersionModal document={recentDocument.document} />),
      label: 'Gerenciar versões',
      stroke: false,
    },
    {
      icon: 'downloadV2',
      fill: true,
      onClick: () => {
        DocumentService.show(token, subdomain, recentDocument.documentId)
          .then((document) => {
            window.document.open(document.downloadUrl, '_blank', 'noreferrer');
          })
          .catch((error) => {
            showSnackbar(error.response.data.message, 'error');
          });
      },
      label: 'Download',
      stroke: false,
    },
    {
      icon: 'info',
      fill: false,
      onClick: () =>
        openDrawer(
          <DocumentProperties documentId={recentDocument.documentId} />,
          'right'
        ),
      label: 'Propriedades',
      stroke: true,
    },
    {
      icon: 'folderOutlined',
      fill: false,
      onClick: () => {
        router.push(
          `/printer-air/my-air/organizations/${session.organization.id}/directories/${recentDocument.document.directoryId}`
        );
      },
      label: 'Ir para a pasta',
      stroke: true,
    },
    {
      icon: 'trash',
      fill: false,
      onClick: () => {
        openModal(
          <RemoveItemsModal
            selectedDirectoryIds={[]}
            selectedDocumentIds={[recentDocument.documentId]}
          />
        );
      },
      label: 'Remover',
      stroke: true,
    },
  ];

  return <MenuCell options={options} />;
};

export default MenuCellContainer;
