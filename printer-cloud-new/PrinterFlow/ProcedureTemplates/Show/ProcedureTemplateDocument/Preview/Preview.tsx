import * as React from 'react';
import { ActionBox } from 'printer-ui';
import { useModal } from '../../../../../hooks';
import { removeFileExtension } from '../../../../../utils';
import { DocumentPreviewModalProps } from './types';
import ProcedureTemplateDocumentModalContent from './Content';

const DocumentPreviewModal = ({
  procedureTemplateDocument,
}: DocumentPreviewModalProps) => {
  const { closeModal } = useModal();
  return (
    <ActionBox>
      <ActionBox.Header
        title={removeFileExtension(procedureTemplateDocument.name)}
        color="blue"
        icon="pdfFileV2"
        fill
        className="w-full"
        onClose={closeModal}
      />
      <ActionBox.Content className="w-full">
        <ProcedureTemplateDocumentModalContent
          procedureTemplateDocumentId={procedureTemplateDocument.id}
        />
      </ActionBox.Content>
    </ActionBox>
  );
};

export default DocumentPreviewModal;
