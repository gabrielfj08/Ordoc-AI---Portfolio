import * as React from 'react';
import { AppBarCidadaoContainerProps } from './types';
import AppBarCidadaoMain from './AppbarMain';
import AppBarCidadaoInternal from './AppbarInternal';

const AppBarCidadaoContainer = ({
  className: cn,
  color,
  children,
  backgroundImg,
  userName,
  imageUrl,
  imageLogo,
  icon,
}: AppBarCidadaoContainerProps) => {
  return (
    <>
      <AppBarCidadaoMain
        className={cn}
        color={color}
        children={children}
        userName={userName}
        backgroundImg={backgroundImg}
        imageUrl={imageUrl}
        imageLogo={imageLogo}
      />
      <AppBarCidadaoInternal
        className={cn}
        color={color}
        children={children}
        icon={icon}
      />
    </>
  );
};

export default AppBarCidadaoContainer;
