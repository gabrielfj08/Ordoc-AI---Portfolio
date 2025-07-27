import * as React from 'react';
import { SelectV3 as Select } from 'printer-ui';
import { sortOptions } from '.';
import { SignatureExternalSortSelectProps } from './types';

const SignatureExternalSortSelect = ({
  size,
  w,
  color,
  label,
  setSortSelection,
  sortSelection,
}: SignatureExternalSortSelectProps) => {
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

export default SignatureExternalSortSelect;
