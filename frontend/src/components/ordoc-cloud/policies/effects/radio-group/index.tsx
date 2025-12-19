'use client';

import * as React from 'react';
import { PolicyEffectsRadioGroupContainerProps } from './types';
import PolicyEffectsRadioGroup from './RadioGroup';

const PolicyEffectsRadioGroupContainer = ({
  disabled = false,
  value,
  onChange,
  error,
}: PolicyEffectsRadioGroupContainerProps) => {
  return (
    <PolicyEffectsRadioGroup
      disabled={disabled}
      value={value}
      onChange={onChange}
      error={error}
    />
  );
};

export default PolicyEffectsRadioGroupContainer;
