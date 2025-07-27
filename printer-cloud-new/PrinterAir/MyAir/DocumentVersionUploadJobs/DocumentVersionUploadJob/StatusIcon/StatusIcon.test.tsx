import * as React from 'react';
import { render } from '@testing-library/react';
import { DocumentVersionUploadJobStatus } from '../../../../../PrinterAir/constants';
import DocumentVersionUploadJobStatusIcon from './StatusIcon';

describe('DocumentVersionUploadJobStatusIcon', () => {
  it('renders the status icon', () => {
    render(
      <DocumentVersionUploadJobStatusIcon status={DocumentVersionUploadJobStatus.running} />
    );
  });
});
