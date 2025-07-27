import * as React from 'react';
import { SelectGroupRequestersContainerProps } from './types';
import SelectGroupRequesters from './SelectGroupRequesters';

const SelectGroupRequestersContainer = ({
  name,
  groupRequester,
}: SelectGroupRequestersContainerProps) => {
  return <SelectGroupRequesters name={name} groupRequester={groupRequester} />;
};

export default SelectGroupRequestersContainer;
