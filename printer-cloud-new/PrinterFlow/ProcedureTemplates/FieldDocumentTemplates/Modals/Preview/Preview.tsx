import * as React from 'react';
import { ActionBox } from 'printer-ui';
import { useModal } from '../../../../../hooks';
import { FieldDocumentTemplatePreviewModalProps } from './types';
import FieldDocumentTemplateModalContent from './Content';

const FieldDocumentTemplatePreviewModal = ({
  fieldDocumentTemplate,
}: FieldDocumentTemplatePreviewModalProps) => {
  const { closeModal } = useModal();
  return (
    <ActionBox>
      <ActionBox.Header
        title={fieldDocumentTemplate.name}
        color="blue"
        icon="pdfFileV2"
        fill
        className="w-full"
        onClose={closeModal}
      />
      <ActionBox.Content className="w-full">
        <FieldDocumentTemplateModalContent
          fieldDocumentTemplate={fieldDocumentTemplate}
        />
      </ActionBox.Content>
    </ActionBox>
  );
};

export default FieldDocumentTemplatePreviewModal;
