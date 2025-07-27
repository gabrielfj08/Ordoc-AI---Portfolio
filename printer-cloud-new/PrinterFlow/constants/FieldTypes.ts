import { fieldTypes } from '../components/Procedures/FieldTypes/types';

export const FieldTypesMapping: Record<string, fieldTypes> = {
  cpf: 'cpf',
  cnpj: 'cnpj',
  radio: 'radio',
  checkbox: 'checkbox',
  email: 'email',
  phone: 'phone',
  attachment: 'attachment',
  date: 'date',
  time: 'time',
  select: 'select_field',
  numeric: 'numeric',
  shortText: 'short_text',
  longText: 'long_text',
};
