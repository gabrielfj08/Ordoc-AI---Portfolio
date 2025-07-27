import { icon } from 'printer-ui';

export interface AppBarCidadaoMainProps {
  className?: string;
  backgroundImg?: string;
  imageUrl?: string;
  imageLogo?: string;
  color?: string;
  children?: React.ReactNode;
  userName?: string;
  subtitle?: string;
}

export interface AppBarCidadaoContainerProps {
  className?: string;
  backgroundImg?: string;
  imageUrl?: string;
  imageLogo?: string;
  color?: string;
  children?: React.ReactNode;
  userName?: string;
  icon: icon | null;
}

export interface AppBarCidadaoInternalProps {
  className?: string;
  color?: string;
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: icon;
  onClick?: React.MouseEventHandler;
}

export const bgColorMapping: Record<string, string> = {
  lightBlue: 'bg-lightBlue',
  blue: 'bg-blue',
  lighterBlack: 'bg-lighterBlack',
  lightBlack: 'bg-lightBlack',
  black: 'bg-black',
  disabled: 'bg-disabled',
  error: 'bg-error',
  green: 'bg-green',
  info: 'bg-info',
  lighterGray: 'bg-lighterGray',
  lightGray: 'bg-lightGray',
  gray: 'bg-gray',
  darkGray: 'bg-darkGray',
  darkerGray: 'bg-darkerGray',
  orange: 'bg-orange',
  primaryLight: 'bg-primaryLight',
  primary: 'bg-primary',
  primaryDark: 'bg-primaryDark',
  purple: 'bg-purple',
  red: 'bg-red',
  darkRed: 'bg-darkRed',
  success: 'bg-success',
  transparent: 'bg-transparent',
  warning: 'bg-warning',
  white: 'bg-white',
  yellow: 'bg-yellow',
  cidBlueLight: 'bg-cidBlueLight',
  cidBlue: 'bg-cidBlue',
  cidBlueDark: 'bg-cidBlueDark',
  cidCyanLight: 'bg-cidCyanLight',
  cidCyan: 'bg-cidCyan',
  cidCyanDark: 'bg-cidCyanDark',
  cidGoldLight: 'bg-cidGoldLight',
  cidGold: 'bg-cidGold',
  cidGoldDark: 'bg-cidGoldDark',
  cidGrayLight: 'bg-cidGrayLight',
  cidGray: 'bg-cidGray',
  cidGrayDark: 'bg-cidGrayDark',
  cidGreenLight: 'bg-cidGreenLight',
  cidGreen: 'bg-cidGreen',
  cidGreenDark: 'bg-cidGreenDark',
  cidMagentaLight: 'bg-cidMagentaLight',
  cidMagenta: 'bg-cidMagenta',
  cidMagentaDark: 'bg-cidMagentaDark',
  cidOrangeLight: 'bg-cidOrangeLight',
  cidOrange: 'bg-cidOrange',
  cidOrangeDark: 'bg-cidOrangeDark',
  cidPurpleLight: 'bg-cidPurpleLight',
  cidPurple: 'bg-cidPurple',
  cidPurpleDark: 'bg-cidPurpleDark',
};
