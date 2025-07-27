import * as React from 'react';
import { useModal } from '../../../hooks';
import { ActionBox, Icon } from 'printer-ui';

const PrivacyTermsModal = () => {
  const { closeModal } = useModal();

  return (
    <ActionBox>
      <ActionBox.Content>
        <div className="h-6 items-center justify-end flex pb-3">
          <button type="button" onClick={closeModal}>
            <Icon alt="close" name="close" color="gray" stroke />
          </button>
        </div>
        <iframe
          src={`https://printer-cloud-assets.s3.sa-east-1.amazonaws.com/production/pdf/Termo_de_uso_Printer_do_brasil.pdf`}
          className="w-[80vw] h-[75vh]"
        />
      </ActionBox.Content>
    </ActionBox>
  );
};

export default PrivacyTermsModal;
