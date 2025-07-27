import * as React from 'react';
import { render } from '@testing-library/react';

import DirectoryUploadJob from './DownloadJob';

describe('DirectoryUploadJob', () => {
  it('renders the zipped directory name', () => {
    const { getByText } = render(
      <DirectoryUploadJob status="created" zipfileName="zip name" />
    );

    expect(getByText('zip name')).toBeInTheDocument();
  });
});
