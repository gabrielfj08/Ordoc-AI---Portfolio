import * as React from 'react';
import { ActionBox } from 'printer-ui';
import { useModal } from '../../../../../../hooks';
import { DocumentPreviewModalProps } from './types';
import DocumentPreviewModalContent from './Content';

const DocumentPreviewModal = ({
  sharedDocument,
}: DocumentPreviewModalProps) => {
  const { closeModal } = useModal();
  return (
    <ActionBox>
      <ActionBox.Header
        title={sharedDocument.document.originalFilename}
        color="blue"
        icon="pdfFileV2"
        fill
        className="w-full"
        onClose={closeModal}
      />
      <ActionBox.Content className="w-full">
        <DocumentPreviewModalContent sharedDocument={sharedDocument} />
      </ActionBox.Content>
    </ActionBox>
  );
};

export default DocumentPreviewModal;
