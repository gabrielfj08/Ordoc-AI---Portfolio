import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { FilterTaskTemplateParams } from './types';
import FilterTaskTemplates from './FilterTaskTemplates';

const filterParams: FilterTaskTemplateParams = {
  order: 'name',
  direction: 'asc',
  page: 1,
  perPage: 10,
  status: 'active',
  q: '',
};

describe('Filter Button component', () => {
  it('renders the button', () => {
    const filterTaskTemplatesButton = render(
      <FilterTaskTemplates params={filterParams} setParams={() => {}}>
        <div>Hello World!</div>
      </FilterTaskTemplates>
    );

    const { getByRole } = filterTaskTemplatesButton;

    expect(getByRole('button', { name: 'Limpar filtro' })).toBeInTheDocument();
  });

  it('opens the dropdown', () => {
    const filterTaskTemplatesButton = render(
      <FilterTaskTemplates setParams={() => {}} params={filterParams}>
        <div>Hello World!</div>
      </FilterTaskTemplates>
    );

    const { getByRole, getByText } = filterTaskTemplatesButton;

    fireEvent.click(getByRole('button', { name: 'Limpar filtro' }));

    expect(getByText('Hello World!')).toBeInTheDocument();
  });
});
