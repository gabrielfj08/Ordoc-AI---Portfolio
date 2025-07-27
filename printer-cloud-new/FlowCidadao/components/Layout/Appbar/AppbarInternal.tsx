import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { AppBarCidadaoInternalProps, bgColorMapping } from './types';

const AppBarCidadaoInternal = ({
  className: cn,
  color,
  children,
  subtitle,
  title,
  icon,
  onClick,
}: AppBarCidadaoInternalProps) => {
  const backgroungColor =
    bgColorMapping[color || 'cidOrange'] || 'bg-cidOrange';
  const className = `${cn}`;

  return (
    <div className={`${className} `}>
      <div className="sm:sticky sm:top-0 w-full bg-white pt-6 sm:pt-8 sm:py-8 sm:z-10">
        <div
          onClick={onClick}
          className={`${backgroungColor} sm:h-16 h-12 flex items-center pl-24 sm:pl-20 cursor-pointer`}
        >
          {icon ? (
            <Icon
              alt="icone do header"
              name={icon}
              stroke
              fill
              color="white"
              className="mr-2 sm:flex hidden"
              w={40}
              h={40}
            />
          ) : null}
          <Typography
            variant="headline3"
            family="jakartaBold"
            color="white"
            align="end"
          >
            {title}
          </Typography>
        </div>
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
      {children}
    </div>
  );
};

export default AppBarCidadaoInternal;
