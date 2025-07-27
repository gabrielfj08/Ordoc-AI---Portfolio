import * as React from 'react';
import {
  ActionBoxV3 as ActionBox,
  TypographyV3 as Typography,
} from 'printer-ui';
import { useModal, useSession } from '../../../../hooks';
import { SignatureExternalDocumentPreviewModalProps } from './types';
import SignableExternalDocumentContent from './Content';
import SignatureExternalActions from './SignatureActions';
import SignatureStatusTagContainer from '../SignatureStatusTag';

const SignatureExternalDocumentPreviewModal = ({
  signature,
  isRefusing,
}: SignatureExternalDocumentPreviewModalProps) => {
  const { closeModal } = useModal();
  const { themeColor } = useSession();

  return (
    <ActionBox onClose={closeModal} className="sm:w-[1044px] w-full h-full">
      <ActionBox.Header
        title={signature.signable.name}
        color={themeColor}
        icon="signaturesV3"
        stroke
        className="w-full"
        subtitle={
          signature.status === 'created'
            ? 'Sua assinatura foi solicitada para este processo'
            : `Última atualização em ${new Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'short',
              }).format(
                new Date(
                  new Date(signature.updatedAt)
                    .toISOString()
                    .replace('.000Z', '')
                )
              )}`
        }
      />
      <div className="flex justify-end items-center space-x-2">
        <Typography family="jakartaBold">Status:</Typography>

        <SignatureStatusTagContainer status={signature.status} />
      </div>
      <ActionBox.Content className="w-full">
        <SignableExternalDocumentContent signature={signature} />
        <SignatureExternalActions
          signature={signature}
          refuseFormInitialState={isRefusing}
        />
      </ActionBox.Content>
    </ActionBox>
  );
};

export default SignatureExternalDocumentPreviewModal;
