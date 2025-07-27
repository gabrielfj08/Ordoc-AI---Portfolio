import * as React from 'react';
import { Select } from 'printer-ui';

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
];

const DirectoriesSortSelect = ({ w, setSortSelection, sortSelection }) => {
  return (
    <Select
      w={w}
      items={sortOptions}
      setSelectedItem={setSortSelection}
      selectedItem={sortSelection}
    />
  );
};

export default DirectoriesSortSelect;
