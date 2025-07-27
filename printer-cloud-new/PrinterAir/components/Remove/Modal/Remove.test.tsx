import * as React from 'react';
import { render } from '@testing-library/react';

import RemoveItemsModal from './Remove';

describe('RemoveItemsModal', () => {
  it('renders modal title', () => {
    const handleSubmit = jest.fn();

    const removeItemsModal = render(
      <RemoveItemsModal
        onSubmit={handleSubmit}
        selectedDirectoryIds={[]}
        selectedDocumentIds={[]}
      />
    );

    const { getAllByText } = removeItemsModal;

    expect(getAllByText('Remover')[0]).toBeInTheDocument();
  });

  it('renders modal content', () => {
    const handleSubmit = jest.fn();

    const removeItemsModal = render(
      <RemoveItemsModal
        onSubmit={handleSubmit}
        selectedDirectoryIds={[]}
        selectedDocumentIds={[]}
      />
    );

    const { getByText } = removeItemsModal;

    expect(
      getByText('Estou ciente que irei mover os itens para a lixeira.')
    ).toBeInTheDocument();
  });
});
