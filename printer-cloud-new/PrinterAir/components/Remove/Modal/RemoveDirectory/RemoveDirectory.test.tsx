import * as React from 'react';
import { render } from '@testing-library/react';

import RemoveDirectory from './RemoveDirectory';

describe('RemoveDirectory', () => {
  it('render directory name', () => {
    const removeDirectory = render(
      <RemoveDirectory directoryName="Downloads" />
    );

    const { getByText } = removeDirectory;

    expect(getByText('Downloads')).toBeInTheDocument();
  });
});
