import * as React from 'react';
import { render } from '@testing-library/react';
import Update from './Update';

describe('Update', () => {
  it('renders modal title', () => {
    const updateGroupModal = render(
      <Update
        group_id={5}
        organization_name="Instituição"
        organization_cnpj="27.849.444/0001-52"
        organization_id={1}
      />
    );

    const { getByText } = updateGroupModal;

    expect(getByText('Editar grupo')).toBeInTheDocument();
  });

  it('renders add button', () => {
    const updateGroupModal = render(
      <Update
        group_id={5}
        organization_name="Instituição"
        organization_cnpj="27.849.444/0001-52"
        organization_id={1}
      />
    );

    const { getByText } = updateGroupModal;

    expect(getByText('Salvar alterações')).toBeInTheDocument();
  });
});
