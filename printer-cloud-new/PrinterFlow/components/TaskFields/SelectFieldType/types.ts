import { fieldTypeParams } from '../../../../services/printer-flow/types/taskField';

export interface SelectFieldTypeContainerProps {
  name: string;
  fieldType: Array<{
    name: string;
    value: fieldTypeParams;
  }>;
}

export interface SelectFieldTypeProps {
  name: string;
  fieldType: Array<{
    name: string;
    value: fieldTypeParams;
  }>;
}
