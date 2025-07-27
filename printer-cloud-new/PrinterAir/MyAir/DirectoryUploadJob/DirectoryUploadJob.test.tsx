import * as React from 'react';
import { render } from '@testing-library/react';
import DirectoryUploadJob from './DirectoryUploadJob';

describe('DirectoryUploadJob', () => {
  it('renders the directory name', () => {
    const { getByText } = render(
      <DirectoryUploadJob status="created" directoryName="testDirectory" />
    );

    expect(getByText('testDirectory')).toBeInTheDocument();
  });
});
