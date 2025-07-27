import * as React from 'react';
import CreateProcedureStepper from './CreateProcedureStepper';
import { useSession } from '../../../../hooks';

interface CreateProcedureStepperContainerProps {
  activeStep: number;
}

const CreateProcedureStepperContainer = ({
  activeStep,
}: CreateProcedureStepperContainerProps) => {
  const { themeColor } = useSession();

  return <CreateProcedureStepper color={themeColor} activeStep={activeStep} />;
};

export default CreateProcedureStepperContainer;
