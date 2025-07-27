import * as React from 'react';
import { render } from '@testing-library/react';
import FieldsMenuButton from './MenuButton';
import { menuOptions } from '../../../../components/MenuButton/types';

describe('Menu table cell', () => {
  it('renders the menu button', () => {
    const testOptions: menuOptions[] = [
      {
        label: 'Editar',
        icon: 'write',
        fill: true,
        stroke: true,
        onClick: () => {},
      },
    ];

    const menuCell = render(<FieldsMenuButton options={testOptions} />);

    const { getByRole } = menuCell;

    expect(getByRole('button')).toBeInTheDocument();
  });
});
