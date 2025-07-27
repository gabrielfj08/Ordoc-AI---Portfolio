import * as React from 'react';
import { render } from '@testing-library/react';

import Cookies from './Cookies';

describe('Cookies', () => {
  it('renders cookies content', () => {
    const cookies = render(<Cookies />);

    const { getByText } = cookies;

    expect(getByText('Termos de Uso')).toBeInTheDocument();
  });

  it('renders accept button', () => {
    const cookies = render(<Cookies />);

    const { getAllByText } = cookies;

    expect(getAllByText('Aceitar')[0]).toBeInTheDocument();
  });
});
