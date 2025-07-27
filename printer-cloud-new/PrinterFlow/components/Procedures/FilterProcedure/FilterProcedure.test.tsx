import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { FilterProcedureParams } from './types';
import FilterButtonProcedureContainer from '.';

const filterParams: FilterProcedureParams = {
  order: 'name',
  direction: 'asc',
  page: 1,
  perPage: 10,
  source: 'internal',
  status: 'draft',
  priority: 'normal',
  private: 'false',
  q: '',
};

describe('Filter Button component', () => {
  it('renders the button', () => {
    const filterProcedureButton = render(
      <FilterButtonProcedureContainer
        params={filterParams}
        setParams={() => {}}
      >
        <div>Hello World!</div>
      </FilterButtonProcedureContainer>
    );

    const { getByRole } = filterProcedureButton;

    expect(getByRole('button', { name: 'Limpar filtro' })).toBeInTheDocument();
  });

  it('opens the dropdown', () => {
    const filterProcedureButton = render(
      <FilterButtonProcedureContainer
        setParams={() => {}}
        params={filterParams}
      >
        <div>Hello World!</div>
      </FilterButtonProcedureContainer>
    );

    const { getByRole, getByText } = filterProcedureButton;

    fireEvent.click(getByRole('button', { name: 'Limpar filtro' }));

    expect(getByText('Hello World!')).toBeInTheDocument();
  });
});
