import * as React from 'react';
import { render } from '@testing-library/react';
import { menuOptions } from '../../../../../components/MenuButton/types';
import MenuCell from './Menu';

describe('Menu recents table cell', () => {
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
