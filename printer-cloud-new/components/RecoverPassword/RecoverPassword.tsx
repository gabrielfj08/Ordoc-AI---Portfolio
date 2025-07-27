import * as React from 'react';
import OneTimePasswordForm from './OneTimePassword';
import GenerateOTPForm from './GenerateOTPForm';
import { GenerateOtpPayload } from '../../services/types';

const RecoverPassword = () => {
  const [formVisibility, setFormVisibility] = React.useState<boolean>(false);
  const [otpPayload, setOtpPayload] = React.useState<GenerateOtpPayload>({
    username: '',
    notification: 'email',
  });

  return (
    <div>
      <GenerateOTPForm
        setFormVisibility={setFormVisibility}
        setOtpPayload={setOtpPayload}
      />
      <div className={formVisibility ? 'block' : 'hidden'}>
        <OneTimePasswordForm otpPayload={otpPayload} />
      </div>
    </div>
  );
};

export default RecoverPassword;
