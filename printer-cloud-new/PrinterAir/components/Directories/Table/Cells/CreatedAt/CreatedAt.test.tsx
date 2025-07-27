import * as React from 'react';
import { render } from '@testing-library/react';
import CreatedAtCell from './CreatedAt';

const directory = {
  id: 2,
  name: 'Cadastro',
  description: 'Descrição',
  createdById: 1,
  organizationId: 1,
  path: '/1234567890:Meu Air/Cadastro',
  prn: 'prn:printer_air:1234567890:Meu Air/Cadastro/',
  parentDirectory: { id: 1, name: 'Meu Air' },
  createdAt: '2022-12-19T16:35:00.000Z',
  updatedAt: '2022-12-19T16:35:00.000Z',
  previousParentPrn: 'prn:printer_air:1234567890:Meu Air/test folder',
  shared: false,
  updatedBy: {
    id: 1,
    name: 'Jane Doe',
  },
};

describe('Created at table cell', () => {
  it('renders the directory creation date', () => {
    const createdAtCell = render(<CreatedAtCell directory={directory} />);

    const { getByText } = createdAtCell;

    expect(getByText('19/12/2022 16:35:00')).toBeInTheDocument();
  });
});
