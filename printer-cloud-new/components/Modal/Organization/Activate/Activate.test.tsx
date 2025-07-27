import * as React from 'react';
import { render } from '@testing-library/react';

import Activate from './Activate';

describe('Activate', () => {
  it('renders modal title', () => {
    const activateOrganizationModal = render(
      <Activate id={1} name={'Instituicao'} />
    );

    const { getByText } = activateOrganizationModal;

    expect(getByText('Ativar instituição no sistema')).toBeInTheDocument();
  });

  it('renders activate button', () => {
    const activateOrganizationModal = render(
      <Activate id={1} name={'Instituicao'} />
    );

    const { getByText } = activateOrganizationModal;

    expect(getByText('Ativar instituição')).toBeInTheDocument();
  });

  it('renders checkbox input', () => {
    const activateOrganizationModal = render(
      <Activate id={1} name={'Instituicao'} />
    );

    const { getByRole } = activateOrganizationModal;

    expect(getByRole('checkbox')).toBeInTheDocument();
  });
});
