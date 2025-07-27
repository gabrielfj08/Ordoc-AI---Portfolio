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
    direction: 'desc',
  },
  '4': {
    order: 'created_at',
    direction: 'asc',
  },
  '5': {
    order: 'process_number',
    direction: 'asc',
  },
  '6': {
    order: 'deadline',
    direction: 'asc',
  },
  '7': {
    order: 'priority',
    direction: 'desc',
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
    value: 'Mais recentes',
  },
  {
    id: '4',
    value: 'Mais antigos',
  },
  {
    id: '5',
    value: 'Código',
  },
  {
    id: '6',
    value: 'Prazo',
  },
  {
    id: '7',
    value: 'Prioridade',
  },
];
