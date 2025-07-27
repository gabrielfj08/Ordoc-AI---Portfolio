import * as React from 'react';
import { render } from '@testing-library/react';
import { GeneratePDFStatus } from '../../../../../PrinterAir/constants';
import GeneratePDFStatusIcon from './StatusIcon';

describe('Status Icon component', () => {
  it('renders the icon', () => {
    render(<GeneratePDFStatusIcon status={GeneratePDFStatus.running} />);
  });
});
