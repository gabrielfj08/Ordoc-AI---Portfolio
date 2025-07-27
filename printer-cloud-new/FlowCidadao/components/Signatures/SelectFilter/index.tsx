export { default } from './SelectFilter';

export const sortMapping: Record<string, Record<string, string>> = {
  '1': {
    status: 'allStatus',
  },
  '2': {
    status: 'created',
  },
  '3': {
    status: 'refused',
  },
  '4': {
    status: 'signed',
  },
};

export const sortOptions = [
  {
    id: '1',
    value: 'allStatus',
    label: 'Todos',
  },
  {
    id: '2',
    value: 'created',
    label: 'Pendente',
  },
  {
    id: '3',
    value: 'refused',
    label: 'Recusado',
  },
  {
    id: '4',
    value: 'signed',
    label: 'Assinado',
  },
];
