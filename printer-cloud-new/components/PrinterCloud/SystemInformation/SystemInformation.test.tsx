import * as React from 'react';
import { render } from '@testing-library/react';

import SystemInformation from './SystemInformation';

describe('System Information field', () => {
  it('renders the title', () => {
    const systemInformation = render(
      <SystemInformation
        about={{
          name: 'Test Name',
          version: '2.12.13',
          releasedAt: '12/12/1990',
        }}
      />
    );

    const { getByText } = systemInformation;

    expect(getByText('Informações do sistema')).toBeInTheDocument();
  });

  it('renders system name', () => {
    const systemInformation = render(
      <SystemInformation
        about={{
          name: 'Test Name',
          version: '2.12.13',
          releasedAt: '12/12/1990',
        }}
      />
    );

    const { getByText } = systemInformation;

    expect(getByText('Test Name')).toBeInTheDocument();
  });

  it('renders system updata date', () => {
    const systemInformation = render(
      <SystemInformation
        about={{
          name: 'Test Name',
          version: '2.12.13',
          releasedAt: '12/12/1990',
        }}
      />
    );

    const { getByText } = systemInformation;

    expect(getByText('12/12/1990')).toBeInTheDocument();
  });

  it('renders system version', () => {
    const systemInformation = render(
      <SystemInformation
        about={{
          name: 'Test Name',
          version: '2.12.13',
          releasedAt: '12/12/1990',
        }}
      />
    );

    const { getByText } = systemInformation;

    expect(getByText('2.12.13')).toBeInTheDocument();
  });
});
