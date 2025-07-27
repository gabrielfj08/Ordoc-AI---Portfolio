import * as React from 'react';
import { ProcessNumberCellContainerProps } from './types';
import ProcessNumberCell from './ProcessNumber';

const ProcessNumberCellContainer = ({
  procedure,
}: ProcessNumberCellContainerProps) => {
  return <ProcessNumberCell procedure={procedure} />;
};

export default ProcessNumberCellContainer;
