export { default } from './Select';

export const sortMapping: Record<string, Record<string, string>> = {
  '1': {
    order: 'created_at',
    direction: 'desc',
  },
  '2': {
    order: 'created_at',
    direction: 'asc',
  },
};

export const sortOptions = [
  {
    id: '1',
    value: 'Mais recentes',
  },
  {
    id: '2',
    value: 'Mais antigas',
  },
];
