export { default } from './Select';

export const sortMapping: Record<string, Record<string, string>> = {
  '1': {
    order: 'updated_at',
    direction: 'desc',
  },
  '2': {
    order: 'updated_at',
    direction: 'asc',
  },
  '3': {
    order: 'name',
    direction: 'asc',
  },
  '4': {
    order: 'name',
    direction: 'desc',
  },
  '5': {
    order: 'deadline',
    direction: 'asc',
  },
  '6': {
    order: 'priority',
    direction: 'desc',
  },
};

export const sortOptions = [
  {
    id: '1',

    value: 'Mais recentes',
  },
  {
    id: '2',

    value: 'Mais antigos',
  },
  {
    id: '3',
    value: 'Ordem Alfabética A-Z',
  },
  {
    id: '4',
    value: 'Ordem Alfabética Z-A',
  },
  {
    id: '5',
    value: 'Prazo',
  },
  {
    id: '6',
    value: 'Prioridade',
  },
];
