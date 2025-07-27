export interface SelectProps {
  disabled?: boolean;
  name: string;
  options: Array<SelectOption>;
}

export interface SelectOption {
  name: string;
  value: string;
}
