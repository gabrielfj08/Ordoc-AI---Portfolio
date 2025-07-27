import React from 'react';
import { icon } from 'printer-ui';

export interface SidebarProps {
  className?: string;
  src?: string;
  logo?: string;
  userName?: string;
  avatar?: React.ReactNode;
  children?: React.ReactNode;
  bgColor?: sidebarBgColor;
}

export interface SidebarButtonProps {
  className?: string;
  color: color;
  iconColor?: color;
  fill?: boolean;
  icon: icon | null;
  onClick: React.MouseEventHandler;
  selected?: boolean;
  open?: boolean;
  stroke?: boolean;
  title: string;
  id?: string;
  bgColor?: sidebarBgColor;
}

export interface LayoutProps {
  theme?: any;
  userName: any;
  children: React.ReactNode;
  backgroundImg?: string;
  imageUrl?: string;
  imageLogo?: string;
  internal: boolean;
  title?: string;
  subtitle?: string;
  icon?: icon;
  onClick?: React.MouseEventHandler;
}

export interface LayoutContainerProps {
  children: React.ReactNode;
  internal: boolean;
  title?: string;
  subtitle?: string;
  icon?: icon;
  onClick?: React.MouseEventHandler;
}

export type color =
  | 'lighterBlack'
  | 'lightBlack'
  | 'black'
  | 'lightBlue'
  | 'blue'
  | 'disabled'
  | 'green'
  | 'info'
  | 'error'
  | 'lighterGray'
  | 'lightGray'
  | 'gray'
  | 'darkGray'
  | 'darkerGray'
  | 'orange'
  | 'primaryLight'
  | 'primary'
  | 'primaryDark'
  | 'purple'
  | 'red'
  | 'darkRed'
  | 'success'
  | 'transparent'
  | 'warning'
  | 'white'
  | 'yellow'
  | 'cidBlueLight'
  | 'cidBlue'
  | 'cidBlueDark'
  | 'cidCyanLight'
  | 'cidCyan'
  | 'cidCyanDark'
  | 'cidGoldLight'
  | 'cidGold'
  | 'cidGoldDark'
  | 'cidGrayLight'
  | 'cidGray'
  | 'cidGrayDark'
  | 'cidGreenLight'
  | 'cidGreen'
  | 'cidGreenDark'
  | 'cidOrangeLight'
  | 'cidOrange'
  | 'cidOrangeDark'
  | 'cidPurpleLight'
  | 'cidPurple'
  | 'cidPurpleDark';

export type sidebarBgColor =
  | 'white'
  | 'cidBlueLight'
  | 'cidBlue'
  | 'cidBlueDark'
  | 'cidCyanLight'
  | 'cidCyan'
  | 'cidCyanDark'
  | 'cidGoldLight'
  | 'cidGold'
  | 'cidGoldDark'
  | 'cidGrayLight'
  | 'cidGray'
  | 'cidGrayDark'
  | 'cidGreenLight'
  | 'cidGreen'
  | 'cidGreenDark'
  | 'cidOrangeLight'
  | 'cidOrange'
  | 'cidOrangeDark'
  | 'cidPurpleLight'
  | 'cidPurple'
  | 'cidPurpleDark';

export const bgColorSidebarMapping: Record<string, string> = {
  white: 'bg-white',
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
  cidOrangeLight: 'bg-cidOrangeLight',
  cidOrange: 'bg-cidOrange',
  cidOrangeDark: 'bg-cidOrangeDark',
  cidPurpleLight: 'bg-cidPurpleLight',
  cidPurple: 'bg-cidPurple',
  cidPurpleDark: 'bg-cidPurpleDark',
};
