import * as React from 'react';
import { render } from '@testing-library/react';
import { IndexDirectory } from '../../../../../../services/printer-air/types';

import StatusCell from './Status';

const directory: IndexDirectory = {
  id: 2,
  name: 'Diretorio',
  description: 'Descrição',
  organizationId: 1,
  prn: 'prn:printer_air:1234567890:Meu Air/Diretorio',
  previousParentPrn: 'prn:printer_air:1234567890:Meu Air',
  createdAt: '2022-12-19T16:35:00.000Z',
  updatedAt: '2022-12-19T16:35:00.000Z',
  createdById: 1,
  path: 'Meu Air/Diretorio',
  shared: true,
  updatedBy: {
    id: 2,
    name: 'Usuario',
  },
  parentDirectory: {
    id: 1,
    name: 'My Air',
  },
};

describe('Status table cell', () => {
  it('renders the directory status', () => {
    const statusCell = render(<StatusCell directory={directory} />);

    const { getByTestId } = statusCell;

    expect(getByTestId('icon')).toBeInTheDocument();
  });
});
