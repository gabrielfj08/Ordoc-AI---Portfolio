export { default } from './Select';

export const sortMapping: Record<string, Record<string, string>> = {
  '1': {
    order: 'name',
    direction: 'asc',
  },
  '2': {
    order: 'name',
    direction: 'desc',
  },
  '3': {
    order: 'created_at',
    direction: 'asc',
  },
  '4': {
    order: 'created_at',
    direction: 'desc',
  },
  '5': {
    order: 'deadline',
    direction: 'asc',
  },
};

export const sortOptions = [
  {
    id: '1',
    value: 'Ordem Alfabética A-Z',
  },
  {
    id: '2',
    value: 'Ordem Alfabética Z-A',
  },
  {
    id: '3',
    value: 'Mais antigos',
  },
  {
    id: '4',
    value: 'Mais recentes',
  },
  {
    id: '5',
    value: 'Prazo',
  },
];
