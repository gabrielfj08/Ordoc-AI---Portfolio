import * as React from 'react';
import { Button } from 'printer-ui';
import { useModal } from '../../../../../hooks';
import { SendPasswordProps } from './types';

const SendPassword = ({
  buttonDisabling,
  sendEmailPassword,
  sendSMSPassword,
}: SendPasswordProps) => {
  const { closeModal } = useModal();

  return (
    <div className="w-full">
      <div className="sm:flex justify-between hidden">
        <Button color="error" onClick={closeModal} label="Cancelar" />
        <div className="flex space-x-3">
          <Button
            label="Enviar senha via email"
            color="info"
            onClick={sendEmailPassword}
            disabled={buttonDisabling}
          />
          <Button
            label="Enviar senha via SMS"
            color="info"
            onClick={sendSMSPassword}
            disabled={buttonDisabling}
          />
        </div>
      </div>
      <div className="sm:hidden flex justify-between">
        <Button color="error" onClick={closeModal} label="Cancelar" size="sm" />
        <div className="flex flex-col space-y-2 justify-end">
          <Button
            label="Enviar senha via email"
            size="sm"
            color="info"
            onClick={sendEmailPassword}
            disabled={buttonDisabling}
          />
          <Button
            label="Enviar senha via SMS"
            size="sm"
            color="info"
            onClick={sendSMSPassword}
            disabled={buttonDisabling}
          />
        </div>
      </div>
    </div>
  );
};

export default SendPassword;
