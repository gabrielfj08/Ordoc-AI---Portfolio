import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';

import SelectedItemsMenuButton from './SelectedItemsMenuButton';
import { menuOptions } from './types';

describe('Menu Button component', () => {
  it('renders the button', () => {
    const testOptions: menuOptions[] = [
      {
        icon: 'info',
        fill: false,
        onClick: () => {},
        label: 'Propriedades',
        stroke: true,
      },
      {
        icon: 'info',
        fill: true,
        onClick: () => {},
        label: 'Remover',
        stroke: true,
      },
    ];
    const menuButton = render(
      <SelectedItemsMenuButton options={testOptions} />
    );

    const { getByRole } = menuButton;

    expect(getByRole('button')).toBeInTheDocument();
  });

  it('renders the dropdown', () => {
    const testOptions: menuOptions[] = [
      {
        icon: 'info',
        fill: false,
        onClick: () => {},
        label: 'Move to',
        stroke: true,
      },
      {
        icon: 'info',
        fill: true,
        onClick: () => {},
        label: 'Delete',
        stroke: true,
      },
    ];
    const menuButton = render(
      <SelectedItemsMenuButton options={testOptions} />
    );

    const { getByRole, getByText } = menuButton;

    fireEvent.click(getByRole('button'));

    expect(getByText('Delete')).toBeInTheDocument();
  });

  it('clicks the dropdown option', () => {
    const handleClick = jest.fn();
    const testOptions: menuOptions[] = [
      {
        icon: 'info',
        fill: false,
        onClick: handleClick,
        label: 'Move to',
        stroke: true,
      },
      {
        icon: 'info',
        fill: true,
        onClick: handleClick,
        label: 'Delete',
        stroke: true,
      },
    ];
    const menuButton = render(
      <SelectedItemsMenuButton options={testOptions} />
    );

    const { getByRole, getByText } = menuButton;

    fireEvent.click(getByRole('button'));

    fireEvent.click(getByText('Delete'));

    expect(handleClick).toBeCalledTimes(1);
  });
});
