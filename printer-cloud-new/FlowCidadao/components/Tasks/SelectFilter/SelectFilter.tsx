import * as React from 'react';
import { SelectV3 as Select } from 'printer-ui';
import { sortOptions } from '.';
import { TaskExternalSortSelectProps } from './types';

const TaskExternalSortSelect = ({
  size,
  w,
  color,
  label,
  setSortSelection,
  sortSelection,
}: TaskExternalSortSelectProps) => {
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

export default TaskExternalSortSelect;
