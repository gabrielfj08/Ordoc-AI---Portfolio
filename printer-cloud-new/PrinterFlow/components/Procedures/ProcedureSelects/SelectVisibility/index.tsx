import * as React from 'react';
import SelectVisibility from './SelectVisibility';
import { SelectVisibilityContainerProps } from './types';

const SelectVisibilityContainer = ({
  name,
}: SelectVisibilityContainerProps) => {
  return <SelectVisibility name={name} />;
};

export default SelectVisibilityContainer;
