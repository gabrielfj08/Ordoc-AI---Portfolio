import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';

import FlowFilterButton from '.';

describe('Filter Button component', () => {
  it('renders the button', () => {
    const filterButton = render(
      <FlowFilterButton
        params={''}
        setParams={() => {}}
        filterType={'requester'}
      >
        <div>Hello World!</div>
      </FlowFilterButton>
    );

    const { getByRole } = filterButton;

    expect(getByRole('button', { name: 'Filtrar' })).toBeInTheDocument();
  });

  it('opens the dropdown', () => {
    const filterButton = render(
      <FlowFilterButton
        params={''}
        setParams={() => {}}
        filterType={'requester'}
      >
        <div>Hello World!</div>
      </FlowFilterButton>
    );

    const { getByRole, getByText } = filterButton;

    fireEvent.click(getByRole('button', { name: 'Filtrar' }));

    expect(getByText('Hello World!')).toBeInTheDocument();
  });
});
