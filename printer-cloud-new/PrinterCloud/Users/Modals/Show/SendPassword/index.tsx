import * as React from 'react';
import { useAuth, useModal, useSnackbar } from '../../../../../hooks';
import { UserService } from '../../../../../services';
import { SendPasswordContainerProps } from './types';
import SendPassword from './SendPassword';

const SendPasswordContainer = ({ userId }: SendPasswordContainerProps) => {
  const { token, subdomain } = useAuth();
  const { closeModal } = useModal();
  const { showSnackbar } = useSnackbar();
  const [buttonDisabling, setButtonDisabling] = React.useState<boolean>(false);

  const sendEmailPassword = () => {
    setButtonDisabling(true);
    UserService.sendRandomPassword(token, subdomain, userId, {
      notificationType: 'email',
    })
      .then(() => {
        setButtonDisabling(false);
        showSnackbar('Senha enviada ao usuário via email.', 'success');
        closeModal();
      })
      .catch((err) => {
        setButtonDisabling(false);
        showSnackbar(err.response.data.message, 'error');
      });
  };

  const sendSMSPassword = () => {
    setButtonDisabling(true);
    UserService.sendRandomPassword(token, subdomain, userId, {
      notificationType: 'sms',
    })
      .then(() => {
        setButtonDisabling(false);
        showSnackbar('Senha enviada ao usuário via SMS.', 'success');
        closeModal();
      })
      .catch((err) => {
        setButtonDisabling(false);
        showSnackbar(err.response.data.message, 'error');
      });
  };

  return (
    <SendPassword
      sendSMSPassword={sendSMSPassword}
      sendEmailPassword={sendEmailPassword}
      buttonDisabling={buttonDisabling}
    />
  );
};

export default SendPasswordContainer;
