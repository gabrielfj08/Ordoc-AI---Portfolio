import * as React from 'react';
import { render } from '@testing-library/react';
import PreviewSharedDocumentContent from './Content';

const document = {
  id: 1,
  originalFilename: 'image.pdf',
  location: 'Printer Air',
  description: 'Carregado pelo Printer Driver',
  url: '/path/image.pdf',
  downloadUrl: 'https://example.com/image.pdf',
  byteSize: 100,
};

describe('PreviewDocumentModalContent', () => {
  it('renders the preview content', () => {
    render(<PreviewSharedDocumentContent document={document} />);
  });

  describe('when file extension is unknown', () => {
    const { getByText } = render(
      <PreviewSharedDocumentContent
        document={{ ...document, originalFilename: 'image.pdff' }}
      />
    );

    expect(
      getByText(/O arquivo não pôde ser visualizado./i)
    ).toBeInTheDocument();
  });
});
