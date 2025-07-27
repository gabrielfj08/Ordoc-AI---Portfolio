import * as React from 'react';
import { VisibilityCellContainerProps } from './types';
import VisibilityCell from './Visibility';

const VisibilityCellContainer = ({
  procedure,
}: VisibilityCellContainerProps) => {
  return <VisibilityCell procedure={procedure} />;
};

export default VisibilityCellContainer;
