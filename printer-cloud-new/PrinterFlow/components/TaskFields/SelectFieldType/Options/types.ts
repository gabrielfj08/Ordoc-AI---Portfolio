import { fieldTypeParams } from '../../../../../services/printer-flow/types/taskField';

export interface SelectFieldTypeOptionsContainerProps {
  open: boolean;
  fieldType: Array<{
    name: string;
    value: fieldTypeParams;
  }>;
}

export interface SelectFieldTypeOptionsProps {
  fieldType: Array<{
    name: string;
    value: fieldTypeParams;
  }>;
}
