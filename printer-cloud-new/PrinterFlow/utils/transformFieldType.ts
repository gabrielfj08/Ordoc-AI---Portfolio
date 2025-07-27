import { fieldTypeParams } from '../../services/printer-flow/types';

export const transformFieldType = (fieldType: fieldTypeParams) => {
  switch (fieldType) {
    case 'attachment':
      return 'Anexo de arquivo';
    case 'checkbox':
      return 'Caixa de seleção';
    case 'cnpj':
      return 'CNPJ';
    case 'cpf':
      return 'CPF';
    case 'date':
      return 'Data';
    case 'time':
      return 'Horário';
    case 'email':
      return 'E-mail';
    case 'long_text':
      return 'Texto longo';
    case 'numeric':
      return 'Número';
    case 'phone':
      return 'Telefone';
    case 'radio':
      return 'Múltipla escolha';
    case 'select_field':
      return 'Lista de seleção';
    case 'short_text':
      return 'Texto curto';
    default:
      return '';
  }
};
