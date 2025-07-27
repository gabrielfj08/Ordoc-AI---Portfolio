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

export interface MenuProcedureCellProps {
  options: Array<menuOptions>;
}
