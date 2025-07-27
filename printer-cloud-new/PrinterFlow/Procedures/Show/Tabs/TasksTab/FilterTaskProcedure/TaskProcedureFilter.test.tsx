import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import FilterButtonProcedureContainer from '.';
import { FilterTasksParams } from '../types';

const filterParams: FilterTasksParams = {
  order: 'name',
  direction: 'asc',
  q: '',
  page: 1,
  procedureId: 1,
  perPage: 10,
  status: 'draft',
  priority: 'normal',
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
