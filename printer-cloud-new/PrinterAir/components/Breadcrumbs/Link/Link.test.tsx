import * as React from 'react';
import { render } from '@testing-library/react';
import BreadcrumbsLink from './Link';

describe('BreadcrumbsLink', () => {
  it('renders the children component', () => {
    const { getByText } = render(
      <BreadcrumbsLink href="#">
        Meu Air
      </BreadcrumbsLink>
    );

    expect(getByText(/Meu Air/i)).toBeInTheDocument();
  });
});
