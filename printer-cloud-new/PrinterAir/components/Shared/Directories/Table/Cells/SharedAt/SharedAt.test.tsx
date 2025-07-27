import * as React from 'react';
import { render } from '@testing-library/react';
import { IndexSharedDirectory } from '../../../../../../../services/printer-air/types';
import SharedAtCell from './SharedAt';

describe('SharedAtCell from shared table', () => {
  it('renders the SharedAt', () => {
    const sharedDirectory: IndexSharedDirectory = {
      id: 1,
      parentSharedId: 1,
      objectPrn: 'test/prn/1',
      organizationId: 1,
      prn: 'test/prn/shared/1',
      userId: 1,
      createdAt: '2023-01-31T14:40:31.427Z',
      updatedAt: '2023-01-31T14:40:31.427Z',
      directory: {
        id: 1,
        name: 'directory',
        description: 'description',
      },
      createdBy: {
        id: 2,
        name: 'User',
      },
    };

    const directoryCell = render(
      <SharedAtCell sharedDirectory={sharedDirectory} />
    );

    const { getByText } = directoryCell;

    expect(getByText('31/01/2023 14:40:31')).toBeInTheDocument();
  });
});
