export { default } from './SelectFilter';

export const sortMapping: Record<string, Record<string, string>> = {
  '1': {
    status: '',
  },
  '2': {
    status: 'started',
  },
  '3': {
    status: 'archived',
  },
  '4': {
    status: 'finished',
  },
  '5': {
    status: 'running',
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
    value: 'archived',
    label: 'Arquivado',
  },
  {
    id: '4',
    value: 'finished',
    label: 'Finalizado',
  },
  {
    id: '5',
    value: 'running',
    label: 'Em análise',
  },
];
