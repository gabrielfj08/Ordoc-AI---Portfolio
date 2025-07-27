import * as React from 'react';
import { render } from '@testing-library/react';

import Deactivate from './Deactivate';

describe('Deactivate', () => {
  it('renders modal content', () => {
    const deactivateOrganizationModal = render(
      <Deactivate id={1} name={'Instituicao'} />
    );

    const { getByText } = deactivateOrganizationModal;

    expect(getByText('Você tem certeza da sua ação?')).toBeInTheDocument();
  });

  it('renders corporate name', () => {
    const deactivateOrganizationModal = render(
      <Deactivate id={1} name={'Instituicao'} />
    );

    const { getByText } = deactivateOrganizationModal;

    expect(getByText('Instituicao')).toBeInTheDocument();
  });

  it('renders checkbox input', () => {
    const deactivateOrganizationModal = render(
      <Deactivate id={1} name={'Instituicao'} />
    );

    const { getByRole } = deactivateOrganizationModal;

    expect(getByRole('checkbox')).toBeInTheDocument();
  });
});
