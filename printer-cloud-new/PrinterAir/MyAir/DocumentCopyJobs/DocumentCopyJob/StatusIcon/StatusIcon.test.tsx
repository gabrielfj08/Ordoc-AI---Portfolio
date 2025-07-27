import * as React from 'react';
import { render } from '@testing-library/react';
import { DocumentCopyJobStatus } from '../../../../../PrinterAir/constants';
import DocumentCopyJobStatusIcon from './StatusIcon';

describe('DocumentCopyJobStatusIcon', () => {
  it('renders the status icon', () => {
    render(
      <DocumentCopyJobStatusIcon status={DocumentCopyJobStatus.running} />
    );
  });
});
