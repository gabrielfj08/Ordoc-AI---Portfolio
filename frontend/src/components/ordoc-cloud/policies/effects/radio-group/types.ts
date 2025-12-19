// Types for OrdocCloud Policy Effects RadioGroup component

export interface PolicyEffectsRadioGroupContainerProps {
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export interface PolicyEffectsRadioGroupProps {
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export interface PolicyEffect {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}
