import * as React from 'react';
import { render } from '@testing-library/react';
import { DocumentOCRStatus } from '../../../../../constants';
import DocumentOCR from './DocumentOCR';

describe('ActionSheet', () => {
  it('renders the ActionSheet', () => {
    const { getByText } = render(
      <DocumentOCR status={DocumentOCRStatus.running} />
    );

    expect(getByText('OCR Processando...')).toBeInTheDocument();
  });
});
