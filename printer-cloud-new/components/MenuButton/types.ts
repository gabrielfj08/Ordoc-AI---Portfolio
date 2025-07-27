import { icon } from 'printer-ui';
export interface menuOptions {
  label: string;
  icon: icon;
  fill: boolean;
  stroke: boolean;
  onClick: () => void;
  disabled?: boolean;
  color?: string;
}
export interface MenuButtonProps {
  options: Array<menuOptions>;
}

export interface MenuButtonContainerProps {
  options: Array<menuOptions>;
}
