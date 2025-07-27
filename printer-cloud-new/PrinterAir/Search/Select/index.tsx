export { default } from './Select';

export const sortMapping: Record<string, Record<string, string>> = {
  '1': {
    sort: 'score' + '+' + 'desc',
  },
  '2': {
    sort: 'created_at' + '+' + 'desc',
  },
  '3': {
    sort: 'created_at' + '+' + 'asc',
  },
  '4': {
    sort: 'original_filename_sort' + '+' + 'asc',
  },
  '5': {
    sort: 'original_filename_sort' + '+' + 'desc',
  },
};

export const sortOptions = [
  {
    id: '1',
    value: 'Mais relevantes',
  },
  {
    id: '2',
    value: 'Mais recentes',
  },
  {
    id: '3',
    value: 'Mais antigas',
  },
  {
    id: '4',
    value: 'Ordem Alfabética A-Z',
  },
  {
    id: '5',
    value: 'Ordem Alfabética Z-A',
  },
];
