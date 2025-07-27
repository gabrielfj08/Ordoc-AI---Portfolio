import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { FilterProcedureTemplateParams } from './types';
import FilterButtonProcedureTemplateContainer from '.';

const filterParams: FilterProcedureTemplateParams = {
  order: 'name',
  direction: 'asc',
  page: 1,
  perPage: 10,
  source: 'internal',
  status: 'active',
  q: '',
  root: true,
};

describe('Filter Button component', () => {
  it('renders the button', () => {
    const filterProcedureTemplateButton = render(
      <FilterButtonProcedureTemplateContainer
        params={filterParams}
        setParams={() => {}}
      >
        <div>Hello World!</div>
      </FilterButtonProcedureTemplateContainer>
    );

    const { getByRole } = filterProcedureTemplateButton;

    expect(getByRole('button', { name: 'Limpar filtro' })).toBeInTheDocument();
  });

  it('opens the dropdown', () => {
    const filterProcedureTemplateButton = render(
      <FilterButtonProcedureTemplateContainer
        setParams={() => {}}
        params={filterParams}
      >
        <div>Hello World!</div>
      </FilterButtonProcedureTemplateContainer>
    );

    const { getByRole, getByText } = filterProcedureTemplateButton;

    fireEvent.click(getByRole('button', { name: 'Limpar filtro' }));

    expect(getByText('Hello World!')).toBeInTheDocument();
  });
});
