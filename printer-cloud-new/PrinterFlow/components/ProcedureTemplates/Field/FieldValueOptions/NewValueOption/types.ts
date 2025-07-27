import { BaseFieldValueOption } from '../../../../../../services/printer-flow/types';

export interface NewValueOptionContainerProps {
  fieldId: number;
}

export interface NewValueOptionProps {
  onSubmit: (values: NewValueOptionFormValues) => Promise<BaseFieldValueOption>;
}

export interface NewValueOptionFormValues {
  value: string;
}
