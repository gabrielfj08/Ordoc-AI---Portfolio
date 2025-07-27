import * as React from 'react';
import { Select } from 'printer-ui';
import { sortOptions } from '.';

const ProcedureSortSelect = ({ size, w, setSortSelection, sortSelection }) => {
  return (
    <Select
      size={size}
      w={w}
      items={sortOptions}
      setSelectedItem={setSortSelection}
      selectedItem={sortSelection}
    />
  );
};

export default ProcedureSortSelect;
