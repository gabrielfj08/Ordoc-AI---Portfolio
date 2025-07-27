import * as React from 'react';
import { CellsContainerProps } from '../../types';
import RequesterCell from './Requester';

const RequesterCellContainer = ({ signature }: CellsContainerProps) => {
  return (
    <div className="w-48 hidden lg:flex px-2 justify-center">
      <RequesterCell signature={signature} />
    </div>
  );
};

export default RequesterCellContainer;
