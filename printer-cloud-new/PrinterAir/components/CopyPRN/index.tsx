import * as React from 'react';
import { CopyPrnContainerProps } from './types';
import CopyPRN from './CopyPRN';

const CopyPrnContainer = ({ prn }: CopyPrnContainerProps) => {
  return <CopyPRN prn={prn} />;
};

export default CopyPrnContainer;
