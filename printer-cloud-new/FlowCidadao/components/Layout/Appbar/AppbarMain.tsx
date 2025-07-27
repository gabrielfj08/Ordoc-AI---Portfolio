import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';
import { AppBarCidadaoMainProps, bgColorMapping } from './types';

const AppBarCidadaoMain = ({
  className: cn,
  color,
  backgroundImg,
  children,
  userName,
  subtitle,
  imageUrl,
  imageLogo,
}: AppBarCidadaoMainProps) => {
  const backgroungColor = bgColorMapping[color || 'cidGrayLight'];
  const className = `${cn}`;

  return (
    <div className={`${className}`}>
      <div className="sticky top-0 sm:z-10 bg-white">
        <div className="sm:h-52 h-32 flex flex-1">
          <div className="absolute">
            <img
              className="w-28 h-28 z-10 ml-36 mt-2 sm:hidden flex"
              src={imageLogo}
            />
            <img
              className="w-80 h-24 ml-16 z-10 mt-14 sm:flex hidden"
              src={imageUrl}
            />
          </div>
          <div className="w-full justify-end align-left bg-bottom min-w-full sm:flex hidden">
            <img src={backgroundImg} />
          </div>
        </div>

        <div
          className={`${backgroungColor} sm:h-16 h-12 flex items-center sm:pl-20 pl-7`}
        >
          <Typography
            variant="headline3"
            family="jakartaBold"
            color="white"
            align="end"
          >
            Bem vindo(a), {`${userName}`}!
          </Typography>
        </div>
        <div className="bg-white sm:pb-8">
          <div
            className={`h-16 flex items-center border-${
              color ? color : 'cidOrange'
            } border-b-2 sm:ml-20 sm:mr-10 mx-6`}
          >
            <Typography
              variant="headline5"
              family="jakarta"
              color={color ? color : 'cidOrange'}
              align="start"
            >
              {subtitle}
            </Typography>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default AppBarCidadaoMain;
