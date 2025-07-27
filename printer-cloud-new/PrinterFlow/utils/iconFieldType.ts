import { fieldTypeParams } from '../../services/printer-flow/types';

export const iconFieldType = (fieldType: fieldTypeParams) => {
  switch (fieldType) {
    case 'attachment':
      return 'clip';
    case 'checkbox':
      return 'selectionBox';
    case 'cnpj':
      return 'departmentV2';
    case 'cpf':
      return 'idDoc';
    case 'date':
      return 'calendarV2';
    case 'time':
      return 'clock';
    case 'email':
      return 'email';
    case 'long_text':
      return 'longText';
    case 'numeric':
      return 'number';
    case 'phone':
      return 'phone';
    case 'select_field':
      return 'selectionList';
    case 'short_text':
      return 'shortText';
    default:
      return 'shortText';
  }
};
