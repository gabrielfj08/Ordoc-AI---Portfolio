import * as React from 'react';
import { render } from '@testing-library/react';

import RemoveDocumentJob from './RemoveDocumentJob';

describe('RemoveDocumentJob', () => {
  it('render job message', () => {
    const removeDocumentJob = render(<RemoveDocumentJob status="running" />);

    const { getByText } = removeDocumentJob;

    expect(getByText('Removendo arquivo(s)')).toBeInTheDocument();
  });
});
