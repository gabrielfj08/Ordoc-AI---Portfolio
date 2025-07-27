import * as React from 'react';
import SelectRequesters from './SelectRequesters';
import { SelectRequestersContainerProps } from './types';

const SelectRequestersContainer = ({
  name,
  requester,
}: SelectRequestersContainerProps) => {
  return <SelectRequesters name={name} requester={requester} />;
};

export default SelectRequestersContainer;
