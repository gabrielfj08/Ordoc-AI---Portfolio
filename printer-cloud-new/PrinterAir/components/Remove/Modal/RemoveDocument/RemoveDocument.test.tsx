import * as React from 'react';
import { render } from '@testing-library/react';

import RemoveDocument from './RemoveDocument';

describe('RemoveDocument', () => {
  it('render document name', () => {
    const removeDocument = render(
      <RemoveDocument documentOriginalFilename="Documento base.pdf" />
    );

    const { getByText } = removeDocument;

    expect(getByText('Documento base.pdf')).toBeInTheDocument();
  });
});
