import * as React from 'react';
import { ShowProcedureFieldsContainerProps } from './types';
import ShowProcedureFields from './Show';

const ShowProcedureFieldsContainer = ({
  procedure,
}: ShowProcedureFieldsContainerProps) => {
  return <ShowProcedureFields procedure={procedure} />;
};

export default ShowProcedureFieldsContainer;
