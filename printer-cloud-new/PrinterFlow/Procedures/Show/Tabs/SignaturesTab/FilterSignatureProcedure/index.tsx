import * as React from 'react';
import { SignatureProcedureFilterButtonContainerProps } from './types';
import SignatureProcedureFilterButton from './SignatureProcedureFilter';

const SignatureProcedureFilterButtonContainer = ({
  children,
  params,
  setParams,
}: SignatureProcedureFilterButtonContainerProps) => {
  return (
    <SignatureProcedureFilterButton params={params} setParams={setParams}>
      {children}
    </SignatureProcedureFilterButton>
  );
};

export default SignatureProcedureFilterButtonContainer;
