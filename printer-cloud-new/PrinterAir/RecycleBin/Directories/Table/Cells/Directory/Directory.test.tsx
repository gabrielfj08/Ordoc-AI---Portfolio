import * as React from 'react';
import { render } from '@testing-library/react';

import DirectoryCell from './Directory';
import { IndexDirectory } from '../../../../../../services/printer-air/types';

const directory: IndexDirectory = {
  id: 1,
  name: 'test folder',
  description: 'Description',
  organizationId: 1,
  prn: 'prn:printer_air:1234567890:Lixeira/test folder',
  previousParentPrn: 'prn:printer_air:1234567890:Meu Air/test folder',
  createdAt: '2022-12-19T16:35:00.000Z',
  updatedAt: '2022-12-19T16:35:00.000Z',
  createdById: 1,
  path: 'Lixeira/test folder',
  shared: false,
  updatedBy: {
    id: 1,
    name: 'Jane Doe',
  },
  parentDirectory: {
    id: 1,
    name: 'Lixeira',
  },
};

describe('Directory table cell', () => {
  it('renders the directory name', () => {
    const directoryCell = render(
      <DirectoryCell directory={directory} directoryName={directory.name} />
    );

    const { getAllByText } = directoryCell;

    expect(getAllByText('test folder')[0]).toBeInTheDocument();
  });
});
