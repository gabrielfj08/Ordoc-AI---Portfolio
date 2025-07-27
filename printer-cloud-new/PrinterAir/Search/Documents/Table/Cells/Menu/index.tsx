import * as React from 'react';
import getConfig from 'next/config';
import router from 'next/router';
import {
  useAuth,
  useDrawer,
  useModal,
  useSnackbar,
  useActionSheet,
  useSession,
} from '../../../../../../hooks';
import { DocumentService } from '../../../../../../services/printer-air';
import { MenuCellContainerProps } from './types';
import { menuOptions } from '../../../../../components/MenuButton/types';
import DocumentCopyJobs from '../../../../../MyAir/Documents/ActionSheets/DocumentCopyJobs';
import DocumentOCRJob from '../../../../../MyAir/Documents/ActionSheets/DocumentOCRJob';
import DocumentVersionModal from '../../../../../MyAir/DocumentVersions/Modals/Upload';
import ShareableLinksModal from '../../../../../MyAir/ShareableLinks/Modals';
import ShareDocumentModal from '../../../../../MyAir/Documents/Modals/Share';
import EditDocumentModal from '../../../../../MyAir/Documents/Modals/Edit';
import DocumentProperties from '../../../../../MyAir/Documents/Properties';
import RemoveItemsModal from '../../../../../components/Remove/Modal';
import MoveItemsModal from '../../../../../components/Move/Modal';
import MenuCell from './Menu';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const MenuCellContainer = ({ document }: MenuCellContainerProps) => {
  const { token, subdomain } = useAuth();
  const { openDrawer } = useDrawer();
  const { openModal } = useModal();
  const { openActionSheet } = useActionSheet();
  const { showSnackbar } = useSnackbar();
  const { session } = useSession();

  switch (document.versionId) {
    case null:
      const options: menuOptions[] = [
        {
          icon: 'moveDocTo',
          fill: true,
          onClick: () => {
            openModal(
              <MoveItemsModal
                selectedDirectoryIds={[]}
                selectedDocumentIds={[document.id]}
                organization={session.organization}
              />
            );
          },
          label: 'Mover para',
          stroke: true,
        },
        {
          icon: 'link',
          fill: true,
          onClick: () =>
            openModal(<ShareableLinksModal documentId={document.id} />),
          label: 'Gerar link',
          stroke: false,
        },
        {
          icon: 'arrow',
          fill: true,
          onClick: () => {
            DocumentService.show(token, subdomain, document.id)
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
          onClick: () => openModal(<ShareDocumentModal document={document} />),
          label: 'Compartilhar',
          stroke: false,
        },
        {
          icon: 'ocr',
          fill: true,
          onClick: () =>
            openActionSheet(
              <DocumentOCRJob selectedDocumentIds={[document.id]} />
            ),
          label: 'OCR',
          stroke: false,
        },
        {
          icon: 'write',
          fill: true,
          onClick: () =>
            openModal(
              <EditDocumentModal
                documentId={document.id}
                description={document.description}
                location={document.location}
                originalFilename={document.originalFilename}
              />
            ),
          label: 'Editar',
          stroke: true,
        },
        {
          icon: 'versionsV2',
          fill: true,
          onClick: () =>
            openModal(<DocumentVersionModal document={document} />),
          label: 'Gerenciar versões',
          stroke: false,
        },
        {
          icon: 'duplicateV2',
          fill: true,
          onClick: () =>
            openActionSheet(<DocumentCopyJobs document={document} />),
          label: 'Duplicar',
          stroke: false,
        },
        {
          icon: 'downloadV2',
          fill: true,
          onClick: () => {
            DocumentService.show(token, subdomain, document.id)
              .then((document) => {
                window.document.open(
                  document.downloadUrl,
                  '_blank',
                  'noreferrer'
                );
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
              <DocumentProperties documentId={document.id} />,
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
              `/printer-air/my-air/organizations/${session.organization.id}/directories/${document.directoryId}`
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
                selectedDocumentIds={[document.id]}
              />
            );
          },
          label: 'Remover',
          stroke: true,
        },
      ];
      return <MenuCell options={options} />;

    default: {
      return null;
    }
  }
};

export default MenuCellContainer;
