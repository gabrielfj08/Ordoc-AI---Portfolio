import { menuOptions } from '../../../../../components/MenuButton/types';
import { BaseField } from '../../../../../services/printer-flow/types';

export interface FieldsMenuButtonContainerProps {
  field: BaseField;
  setType: React.Dispatch<React.SetStateAction<fieldType>>;
}
export interface FieldsMenuButtonProps {
  options: Array<menuOptions>;
}

export type fieldType =
  | 'create'
  | 'edit'
  | 'openFieldValueOption'
  | 'openFieldDocumentTemplate'
  | 'show';
