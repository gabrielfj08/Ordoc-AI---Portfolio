import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';

import IndeterminateCheckbox from './IndeterminateCheckbox';

describe('Indeterminate checkbox', () => {
  it('renders the component', () => {
    const indeterminateCheckbox = render(
      <IndeterminateCheckbox indeterminate />
    );

    const { getByRole } = indeterminateCheckbox;

    expect(getByRole('checkbox')).toBeInTheDocument();
  });

  it('turns checked', () => {
    const indeterminateCheckbox = render(
      <IndeterminateCheckbox indeterminate />
    );

    const { getByRole } = indeterminateCheckbox;

    expect(getByRole('checkbox')).not.toBeChecked();

    fireEvent.click(getByRole('checkbox'));

    expect(getByRole('checkbox')).toBeChecked();
  });
});
