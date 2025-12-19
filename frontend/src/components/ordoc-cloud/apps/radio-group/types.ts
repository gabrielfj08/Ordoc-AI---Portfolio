// Types for OrdocCloud Apps RadioGroup component

export interface App {
  id: number;
  name: string;
  service: string;
  description?: string;
  status: 'active' | 'inactive';
}

export interface AppsRadioGroupContainerProps {
  disabled?: boolean;
}

export interface AppsRadioGroupProps {
  apps: App[];
  disabled?: boolean;
}
