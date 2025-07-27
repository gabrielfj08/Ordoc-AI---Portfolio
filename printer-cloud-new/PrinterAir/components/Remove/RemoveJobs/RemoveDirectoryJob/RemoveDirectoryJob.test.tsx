import * as React from 'react';
import { render } from '@testing-library/react';

import RemoveDirectoryJob from './RemoveDirectoryJob';

describe('RemoveDirectoryJob', () => {
  it('render job message', () => {
    const removeDirectoryJob = render(<RemoveDirectoryJob status="running" />);

    const { getByText } = removeDirectoryJob;

    expect(getByText('Removendo pasta(s)')).toBeInTheDocument();
  });
});
