import * as React from 'react';
import Lottie from 'lottie-react';
import { useRouter } from 'next/router';
import { Typography } from 'printer-ui';
import animation from '../public/assets/animations/transition-animation.json';
import { useSnackbar, useAuth } from '../hooks';
import { UserService } from '../services';
import { getSubdomain } from '../utils';

const Transition = () => {
  const { showSnackbar } = useSnackbar();
  const { token } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (token) {
      UserService.me(token, getSubdomain())
        .then((user) => {
          if (user.changedPassword) {
            router.push(`/printer-cloud/home`);
          } else {
            router.push(`/change-password`);
          }
        })
        .catch(() => {
          router.push('/login');
          showSnackbar('Um erro inesperado ocorreu, tente novamente.', 'error');
        });
    }
  }, [token]);

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
            Estamos iniciando sua sessão.
            <br />
            Por favor, aguarde.
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Transition;
