import * as React from 'react';
import { GroupCodeCellContainerProps } from './types';
import GroupCodeCell from './GroupCode';

const GroupCodeCellContainer = ({ group }: GroupCodeCellContainerProps) => {
  return <GroupCodeCell group={group} />;
};

export default GroupCodeCellContainer;
