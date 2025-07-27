import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { menuOptions } from './types';
import MenuButton from '.';

describe('Menu Button component', () => {
  it('renders the button', () => {
    const testOptions: menuOptions[] = [
      {
        label: 'Ver comprovante',
        icon: 'fileV3',
        fill: false,
        stroke: true,
        onClick: () => {},
        color: 'red',
      },
      {
        label: 'Compartilhar',
        icon: 'sharedV3',
        fill: true,
        stroke: false,
        onClick: () => {},
        color: 'red',
      },
    ];

    const menuButton = render(<MenuButton options={testOptions} />);

    const { getByRole } = menuButton;

    expect(getByRole('button')).toBeInTheDocument();
  });

  it('renders the dropdown', () => {
    const testOptions: menuOptions[] = [
      {
        label: 'Ver comprovante',
        icon: 'fileV3',
        fill: false,
        stroke: true,
        onClick: () => {},
        color: 'red',
      },
      {
        label: 'Compartilhar',
        icon: 'sharedV3',
        fill: true,
        stroke: false,
        onClick: () => {},
        color: 'red',
      },
    ];

    const menuButton = render(<MenuButton options={testOptions} />);

    const { getByRole, getByText } = menuButton;

    fireEvent.click(getByRole('button'));

    expect(getByText('Compartilhar')).toBeInTheDocument();
  });

  it('clicks the dropdown option', () => {
    const handleClick = jest.fn();
    const testOptions: menuOptions[] = [
      {
        label: 'Ver comprovante',
        icon: 'fileV3',
        fill: false,
        stroke: true,
        onClick: handleClick,
        color: 'red',
      },
      {
        label: 'Compartilhar',
        icon: 'sharedV3',
        fill: true,
        stroke: false,
        onClick: handleClick,
        color: 'red',
      },
    ];

    const menuButton = render(<MenuButton options={testOptions} />);

    const { getByRole, getByText } = menuButton;

    fireEvent.click(getByRole('button'));

    fireEvent.click(getByText('Ver comprovante'));

    expect(handleClick).toBeCalledTimes(1);
  });
});
