import { icon } from 'printer-ui';

export interface menuOptions {
  label: string;
  icon: icon;
  fill: boolean;
  stroke: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export interface SelectedItemsMenuButtonProps {
  options: Array<menuOptions>;
}
