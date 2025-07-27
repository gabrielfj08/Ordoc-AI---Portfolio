import * as React from 'react';
import { render } from '@testing-library/react';

import AppBar from './AppBar';

describe('AppBar', () => {
  describe('renders the AppBar contents', () => {
    it('renders the button', () => {
      const handleClick = jest.fn();
      const appbar = render(<AppBar onClick={handleClick} />);
      const { getByText } = appbar;

      expect(getByText('Verificador de Assinaturas')).toBeInTheDocument();
    });

    it('renders the logo', () => {
      const handleClick = jest.fn();
      const appbar = render(<AppBar onClick={handleClick} />);
      const { getByAltText } = appbar;

      expect(getByAltText('Printer Cloud Logo')).toBeInTheDocument();
    });
  });
});
