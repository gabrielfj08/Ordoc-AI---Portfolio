import * as React from 'react';
import { PolicyEffectsRadioGroupContainerProps } from './types';
import PolicyEffectsRadioGroup from './RadioGroup';

const PolicyEffectsRadioGroupContainer = ({
  disabled = false,
}: PolicyEffectsRadioGroupContainerProps) => {
  return <PolicyEffectsRadioGroup disabled={disabled} />;
};

export default PolicyEffectsRadioGroupContainer;
