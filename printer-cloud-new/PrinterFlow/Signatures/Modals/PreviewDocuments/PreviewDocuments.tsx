import * as React from 'react';
import { ActionBox } from 'printer-ui';
import { useModal } from '../../../../hooks';
import { removeFileExtension } from '../../../../utils';
import { SignatureDocumentPreviewModalProps } from './types';
import SignatureActionsDocument from './SignatureActions';
import SignableDocumentContent from './Content';

const SignatureDocumentPreviewModal = ({
  signature,
}: SignatureDocumentPreviewModalProps) => {
  const { closeModal } = useModal();

  return (
    <ActionBox className="sm:w-[1044px] w-full">
      <ActionBox.Header
        title={removeFileExtension(signature.signable?.name)}
        color="blue"
        icon="pdfFileV2"
        fill
        className="w-full"
        onClose={closeModal}
      />
      <ActionBox.Content className="w-full">
        <SignableDocumentContent signature={signature} />
        <SignatureActionsDocument signature={signature} />
      </ActionBox.Content>
    </ActionBox>
  );
};

export default SignatureDocumentPreviewModal;
