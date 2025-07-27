import * as React from 'react';
import { LastAccessedAtCellContainerProps } from './types';
import LastAccessedAtCell from './LastAccessedAt';

const LastAccessedAtCellContainer = ({
  recentDocument,
}: LastAccessedAtCellContainerProps) => {
  return <LastAccessedAtCell recentDocument={recentDocument} />;
};

export default LastAccessedAtCellContainer;
