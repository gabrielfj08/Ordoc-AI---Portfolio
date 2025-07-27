import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';

import Restore from './Restore';

const testItems = [{ id: 1, name: 'test file.img 12:23:15' }];

describe('Restore modal', () => {
  it('renders the modal content', () => {
    const restoreModal = render(
      <Restore
        selectedDocuments={testItems}
        selectedDirectories={[]}
        onSubmit={() => {
          jest.fn();
        }}
      />
    );

    const { getByText } = restoreModal;

    expect(
      getByText('Você tem certeza que deseja recuperar o item abaixo?')
    ).toBeInTheDocument();
  });

  it('renders the footer buttons', () => {
    const handleSubmit = jest.fn();
    const restoreModal = render(
      <Restore
        selectedDocuments={testItems}
        selectedDirectories={[]}
        onSubmit={handleSubmit}
      />
    );

    const { getByRole } = restoreModal;

    expect(getByRole('button', { name: 'Recuperar' })).toBeInTheDocument();
  });
});
