import { fieldTypeParams } from '../../../../../services/printer-flow/types';

export interface NewFieldTypeValuesContainerProps {
  name: string;
  fieldType: Array<{
    name: string;
    value: fieldTypeParams;
  }>;
}

export interface NewFieldTypeValuesSelectProps {
  name: string;
  fieldType: Array<{
    name: string;
    value: fieldTypeParams;
  }>;
}
