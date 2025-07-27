import * as React from 'react';
import { render } from '@testing-library/react';
import DocumentUploadJobsActionSheet from './DocumentUploadJobs';

describe('ActionSheet', () => {
  it('renders the ActionSheet', () => {
    const { getByText } = render(<DocumentUploadJobsActionSheet documentUploadJobIds={[]} />);

    expect(getByText(/Envio de arquivos/i)).toBeInTheDocument();
  });
});
