import * as React from 'react';
import { render } from '@testing-library/react';
import Accordion from './Accordion';

const items = [
  {
    label: 'Pastas',
    content: null,
  },
  {
    label: 'Arquivos',
    content: null,
  },
];

describe('Accordion', () => {
  it('renders the item labels', () => {
    const { getByText } = render(<Accordion items={items} defaultOpen />);

    expect(getByText(/pastas/i)).toBeInTheDocument();
  });
});
