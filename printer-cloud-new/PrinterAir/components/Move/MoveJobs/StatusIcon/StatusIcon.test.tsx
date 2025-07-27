import * as React from 'react';
import { render } from '@testing-library/react';
import { MoveJobStatus } from '../../../../constants';

import StatusIcon from './StatusIcon';

describe('Status Icon component', () => {
  it('renders the icon', () => {
    render(<StatusIcon status={MoveJobStatus.running} />);
  });
});
