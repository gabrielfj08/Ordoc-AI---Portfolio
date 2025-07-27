import * as React from 'react';
import router from 'next/router';
import { ActionBox } from 'printer-ui';
import { useModal } from '../../../../../hooks';
import { DocumentPreviewModalProps } from './types';
import DocumentPreviewModalContent from './Content';
import DocumentPreviewEditInfoContainer from './EditInfo';

const DocumentPreviewModal = ({ document }: DocumentPreviewModalProps) => {
  const { closeModal } = useModal();

  return (
    <ActionBox>
      <ActionBox.Header
        title={document.originalFilename}
        color="blue"
        icon="pdfFileV2"
        fill
        className="w-full"
        onClose={closeModal}
      />
      <ActionBox.Content className="w-full">
        <DocumentPreviewEditInfoContainer documentId={document.id} />
        <DocumentPreviewModalContent document={document} />
      </ActionBox.Content>
    </ActionBox>
  );
};

export default DocumentPreviewModal;
