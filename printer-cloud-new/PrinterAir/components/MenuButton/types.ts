import { icon } from 'printer-ui';
export interface menuOptions {
  label: string;
  icon: icon;
  fill: boolean;
  stroke: boolean;
  type?: 'button' | 'link';
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}
export interface MenuButtonProps {
  options: Array<menuOptions>;
}
export interface MenuButtonContainerProps {
  options: Array<menuOptions>;
}
