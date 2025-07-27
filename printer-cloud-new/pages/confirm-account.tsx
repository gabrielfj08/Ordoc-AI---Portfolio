import * as React from 'react';
import router from 'next/router';
import Lottie from 'lottie-react';
import { Typography } from 'printer-ui';
import animation from '../public/assets/animations/transition-animation.json';
import { UserService } from '../services';
import { useSnackbar } from '../hooks';
import { getSubdomain } from '../utils';

const ConfirmAccount = () => {
  const { showSnackbar } = useSnackbar();
  const confirmation_token = router.query.confirmation_token;

  const confirmationAccount = React.useCallback(async () => {
    if (confirmation_token !== undefined) {
      UserService.confirmAccount(getSubdomain(), confirmation_token)
        .then(() => {
          showSnackbar('E-mail confirmado com sucesso.', 'success');
          router.push('/login');
        })
        .catch((err) => {
          if (err.response.status === 422) {
            showSnackbar(`${err.response.data.message}.`, 'error');
          } else {
            showSnackbar(
              'Um erro inesperado ocorreu, tente novamente.',
              'error'
            );
          }
          router.push('/login');
        });
    } else {
      showSnackbar('Um erro inesperado ocorreu, tente novamente.', 'error');
      router.push('/login');
    }
  }, [confirmation_token, router, showSnackbar]);

  React.useEffect(() => {
    confirmation_token && confirmationAccount();
  }, [confirmation_token]);

  return (
    <div className="h-screen w-screen bg-[#0070c0] flex justify-center items-center fixed">
      <div className="h-fit w-fit justify-center mb-36 fixed -mt-14">
        <div className="h-[30.25rem] w-[30.25rem] sm:h-[50.75rem] sm:w-[50.75rem]">
          <Lottie animationData={animation} />
        </div>
        <div className="flex items-end justify-center sm:-mt-36">
          <Typography
            align="center"
            color="white"
            family="robotoMedium"
            variant="title2"
            className="animate-pulse"
          >
            Aguarde...
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAccount;
