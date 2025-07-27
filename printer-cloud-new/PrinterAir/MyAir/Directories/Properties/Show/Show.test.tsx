import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import { ShowDirectoryAPIResponse } from '../../../../../services/printer-air/types';
import ShowDirectoryProperties from './Show';

const directory: ShowDirectoryAPIResponse = {
  id: 11,
  name: 'Pasta de Notas Fiscais 2023',
  description: 'Guarda notas fiscais emitidas em 2023',
  createdBy: {
    id: 1,
    name: 'Katia Werner',
  },
  updatedBy: {
    id: 1,
    name: 'Katia Werner',
  },
  organizationId: 4,
  path: '/67532506000112/ROOT/Pasta de Notas Fiscais 2023',
  prn: 'prn:printer_air:67532506000112:ROOT/Pasta de Notas Fiscais 2023/',
  parentDirectory: { id: 5, name: '' },
  createdAt: '2023-01-13T12:08:19.182Z',
  updatedAt: '2023-01-13T12:08:19.182Z',
};

describe('DirectoryProperties', () => {
  it('renders the created by updated', () => {
    act(() => {
      render(<ShowDirectoryProperties directory={directory} />);
    });

    expect(screen.getByText('Atualizado por:')).toBeInTheDocument();
  });
});
