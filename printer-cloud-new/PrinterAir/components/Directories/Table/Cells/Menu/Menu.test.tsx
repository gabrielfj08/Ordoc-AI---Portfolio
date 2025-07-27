import * as React from 'react';
import { render } from '@testing-library/react';

import MenuCell from './Menu';
import { menuOptions } from '../../../../../components/MenuButton/types';

describe('Menu table cell', () => {
  it('renders the menu button', () => {
    const testOptions: menuOptions[] = [
      {
        icon: 'close',
        fill: true,
        onClick: () => {},
        label: 'Move to',
        stroke: true,
      },
    ];

    const menuCell = render(<MenuCell options={testOptions} />);

    const { getByRole } = menuCell;

    expect(getByRole('button')).toBeInTheDocument();
  });
});
