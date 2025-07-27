import * as React from 'react';
import { PrnFieldArrayContainerProps } from './types';
import PrnFieldArray from './FieldArray';

const PrnFieldArrayContainer = ({
  disabled = false,
}: PrnFieldArrayContainerProps) => {
  return <PrnFieldArray disabled={disabled} />;
};

export default PrnFieldArrayContainer;
