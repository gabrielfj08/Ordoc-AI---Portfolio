export { default } from './SelectFilter';

export const sortMapping: Record<string, Record<string, string>> = {
  '1': {
    status: '',
  },
  '2': {
    status: 'started',
  },
  '3': {
    status: 'running',
  },
  '4': {
    status: 'finished',
  },
  '5': {
    status: 'refused',
  },
};

export const sortOptions = [
  {
    id: '1',
    value: '',
    label: 'Todos',
  },
  {
    id: '2',
    value: 'started',
    label: 'Tramitando',
  },
  {
    id: '3',
    value: 'running',
    label: 'Aguardando',
  },
  {
    id: '4',
    value: 'finished',
    label: 'Finalizada',
  },
  {
    id: '5',
    value: 'refused',
    label: 'Recusada',
  },
];
