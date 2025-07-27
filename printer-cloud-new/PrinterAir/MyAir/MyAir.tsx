import * as React from 'react';
import router from 'next/router';
import { Button, ButtonRounded, Icon, Typography } from 'printer-ui';
import { useDrawer, useModal, useSession } from '../../hooks';
import { MyAirProps } from './types';
import Header from '../../components/Layout/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import UploadDirectoryModal from './Directories/Modals/Upload';
import UploadDocumentsModal from './Documents/Modals/Upload';
import Directories from './Directories';
import DocumentsTable from './Documents/Table';
import Accordion from '../../components/Accordion';
import NewDirectoryModal from './Directories/Modals/New';
import SelectedItemsMenuButtonContainer from './components/SelectedItemsMenuButton';
import MyAirSkeleton from './Skeleton';
import UnauthorizedMessage from '../Unauthorized';

const MyAir = ({}: MyAirProps) => {
  const { openModal } = useModal();
  const { openDrawer } = useDrawer();
  const { session, unauthorized } = useSession();

  const [selectedDirectoryIds, setSelectedDirectoryIds] = React.useState<
    Array<number>
  >([]);

  const [selectedDocumentIds, setSelectedDocumentIds] = React.useState<
    Array<number>
  >([]);

  if (!session.organization || !session.directory) {
    if (unauthorized) {
      return <UnauthorizedMessage />;
    } else {
      return <MyAirSkeleton />;
    }
  }

  const MyAirButtons = ({}) => {
    return (
      <>
        <Button
          onClick={() => {
            openModal(
              <NewDirectoryModal
                organizationId={Number(session.organization.id)}
                parentDirectoryId={Number(session.directory.id)}
              />
            );
          }}
          color="info"
          label="Nova Pasta"
          className="pr-7 pl-7 truncate"
        >
          <Button.Icon
            name="plus"
            alt="plus"
            color="white"
            w={28}
            h={28}
            stroke
          />
        </Button>
        <Button
          label="Enviar Pasta"
          color="info"
          className="px-6 truncate"
          onClick={() => {
            openModal(
              <UploadDirectoryModal parentDirectory={session.directory} />
            );
          }}
        >
          <Button.Icon
            alt="folderOutlined"
            name="folderOutlined"
            color="white"
            w={28}
            h={28}
            stroke
          />
        </Button>
        <Button
          label="Enviar Arquivo"
          color="info"
          className="truncate"
          onClick={() => {
            openModal(
              <UploadDocumentsModal parentDirectory={session.directory} />
            );
          }}
        >
          <Button.Icon
            alt="pdfFileV2"
            name="pdfFileV2"
            color="white"
            w={28}
            h={28}
            fill
          />
        </Button>
      </>
    );
  };

  return (
    <div className="pb-10">
      <Header className="pl-4 sm:pl-8 mt-8 mb-1 sm:m-0">
        <Breadcrumbs path={session.directory.path} />
      </Header>
      <div className="lg:flex items-end">
        <div className="space-x-2.5 mt-4 pl-3 hidden sm:flex">
          <MyAirButtons />
        </div>
        {selectedDirectoryIds.length || selectedDocumentIds.length ? (
          <div className="w-full px-4 pt-4">
            <SelectedItemsMenuButtonContainer
              selectedDocumentIds={selectedDocumentIds}
              selectedDirectoryIds={selectedDirectoryIds}
            />
          </div>
        ) : null}
      </div>
      <div className="sm:pr-10 sm:px-3 sm:py-8 p-4">
        <Accordion
          defaultOpen
          items={[
            {
              label: 'Pastas',
              content: (
                <Directories
                  organizationId={Number(session.organization?.id)}
                  directoryId={Number(session.directory.id)}
                  setSelectedDirectoryIds={setSelectedDirectoryIds}
                />
              ),
            },
            {
              label: 'Arquivos',
              content: (
                <DocumentsTable
                  directoryId={Number(session.directory.id)}
                  setSelectedDocumentIds={setSelectedDocumentIds}
                  organizationId={Number(session.organization.id)}
                />
              ),
            },
          ]}
        />
      </div>
      <button
        onClick={() => {
          openDrawer(
            <div className="flex flex-col items-center justify-center space-y-8 my-7">
              <Typography variant="headline">Escolha sua ação:</Typography>
              <div className="space-y-5">
                <MyAirButtons />
              </div>
            </div>,
            'bottom'
          );
        }}
        className="sm:hidden fixed bottom-0 z-10 right-0 w-16 h-16 mr-7 mb-7 border border-lightGray
        bg-white shadow-default rounded-full flex items-center justify-center"
      >
        <Icon alt="plus" name="plus" stroke fill color="red" w={40} h={40} />
      </button>
    </div>
  );
};

export default MyAir;
