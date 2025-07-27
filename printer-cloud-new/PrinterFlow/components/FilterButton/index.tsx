import * as React from 'react';
import { FlowFilterButtonContainerProps } from './types';
import FlowFilterButton from './FilterButton';

const FlowFilterButtonContainer = ({
  children,
  params,
  setParams,
  filterType,
}: FlowFilterButtonContainerProps) => {
  return (
    <FlowFilterButton
      params={params}
      setParams={setParams}
      filterType={filterType}
    >
      {children}
    </FlowFilterButton>
  );
};

export default FlowFilterButtonContainer;
