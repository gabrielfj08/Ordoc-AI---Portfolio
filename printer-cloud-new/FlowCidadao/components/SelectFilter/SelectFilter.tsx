import * as React from 'react';
import { SelectV3 as Select } from 'printer-ui';
import { sortOptions } from '.';
import { ProcedureExternalSortSelectProps } from './types';

const ProcedureExternalSortSelect = ({
  size,
  w,
  color,
  label,
  setSortSelection,
  sortSelection,
}: ProcedureExternalSortSelectProps) => {
  return (
    <Select
      color={color}
      size={size}
      label={label}
      w={w}
      options={sortOptions}
      onChange={setSortSelection}
      value={sortSelection}
    />
  );
};

export default ProcedureExternalSortSelect;
