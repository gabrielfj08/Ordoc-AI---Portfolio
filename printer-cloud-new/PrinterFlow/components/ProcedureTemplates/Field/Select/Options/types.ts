import { fieldTypeParams } from '../../../../../../services/printer-flow/types';

export interface NewFieldTypeValuesOptionsContainerProps {
  open: boolean;
  fieldType: Array<{
    name: string;
    value: fieldTypeParams;
  }>;
}

export interface SelectNewFieldTypeValuesOptionsProps {
  fieldType: Array<{
    name: string;
    value: fieldTypeParams;
  }>;
}
