import * as React from 'react';
import { render } from '@testing-library/react';
import { DocumentUploadJobStatus } from '../../../../../PrinterAir/constants';
import DocumentUploadJobStatusIcon from './StatusIcon';

describe('DocumentUploadJobStatusIcon', () => {
  it('renders the status icon', () => {
    render(
      <DocumentUploadJobStatusIcon status={DocumentUploadJobStatus.running} />
    );
  });
});
