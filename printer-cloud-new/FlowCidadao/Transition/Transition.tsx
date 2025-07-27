import * as React from 'react';
import router from 'next/router';
import { TypographyV3 as Typography } from 'printer-ui';
import {
  TransitionProps,
  animatedGradientColorMapping,
  gradientColorMapping,
} from './types';

const Transition = ({
  animated,
  externalRequester,
  color,
}: TransitionProps) => {
  if (animated) {
    setTimeout(() => {
      if (externalRequester?.changedPassword) {
        router.push('/flow-cidadao/home');
      } else {
        router.push('/flow-cidadao/change-password');
      }
    }, 4000);
  }

  return (
    <div
      className={`fixed w-full h-full flex 
      ${
        animated
          ? `animate-gradient-x ${animatedGradientColorMapping[color]}`
          : `${gradientColorMapping[color]} bg-500%`
      } bg-gradient-to-tl from-transparent to-transparent items-center justify-center`}
    >
      <Typography
        variant="headline4"
        family="jakartaBold"
        color={color}
        align="center"
        className={`z-20 ${animated ? 'animate-fade-out' : 'animate-none'}`}
      >
        Estamos iniciando sua sessão.
        <br /> Por favor, aguarde.
      </Typography>
    </div>
  );
};

export default Transition;
