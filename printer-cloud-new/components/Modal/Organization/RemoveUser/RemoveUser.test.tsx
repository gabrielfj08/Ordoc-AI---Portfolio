import * as React from 'react';
import { render } from '@testing-library/react';
import RemoveUser from './RemoveUser';

describe('RemoveUser', () => {
  it('renders modal content', () => {
    const removeUserOrganizationModal = render(<RemoveUser id={1} />);

    const { getByText } = removeUserOrganizationModal;

    expect(
      getByText(
        'Ao clicar em remover, o usuário perderá o acesso a todos os grupos, diretórios, arquivos e registros da instituição selecionada abaixo.'
      )
    ).toBeInTheDocument();
  });

  it('renders footer button', () => {
    const removeUserOrganizationModal = render(<RemoveUser id={1} />);

    const { getByText } = removeUserOrganizationModal;

    expect(getByText('Cancelar')).toBeInTheDocument();
  });
});
