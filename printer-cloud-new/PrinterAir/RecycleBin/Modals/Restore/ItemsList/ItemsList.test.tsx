import * as React from 'react';
import { render } from '@testing-library/react';

import ItemsList from './ItemsList';

const testItems = [
  { id: 1, name: 'test file.img 12:23:15' },
  { id: 2, name: 'test file.pdf 17:15:32' },
];

describe('ItemsList component', () => {
  it('renders the name of the items', () => {
    const itemsList = render(
      <ItemsList selectedDocuments={testItems} selectedDirectories={[]} />
    );

    const { getByText } = itemsList;

    expect(getByText('test file.pdf')).toBeInTheDocument();
  });
});
