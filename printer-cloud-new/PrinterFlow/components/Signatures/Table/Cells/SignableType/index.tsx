import * as React from 'react';
import { CellsContainerProps } from '../../types';
import SignableTypeCell from './SignableType';

const SignableTypeCellContainer = ({ signature }: CellsContainerProps) => {
  return (
    <div className="2xl:flex justify-center hidden">
      <SignableTypeCell signature={signature} />
    </div>
  );
};

export default SignableTypeCellContainer;
