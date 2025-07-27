import * as React from 'react';
import { Stepper, cidColors } from 'printer-ui';
import { steps } from './steps';

interface CreateProcedureStepperProps {
  color: cidColors | string;
  activeStep: number;
}

const CreateProcedureStepper = ({
  color,
  activeStep,
}: CreateProcedureStepperProps) => {
  return <Stepper color={color} steps={steps} activeStep={activeStep} />;
};

export default CreateProcedureStepper;
