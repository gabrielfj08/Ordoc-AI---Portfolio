import * as React from 'react';
import { render } from '@testing-library/react';

import WidgetOptical from './WidgetOptical';

describe('WidgetOptical', () => {
  it('renders widget title', () => {
    const widgetOptical = render(
      <WidgetOptical organizationID={1} storageLimit={'100.0'} />
    );
    const { getByText } = widgetOptical;

    expect(getByText('OPTICAL')).toBeInTheDocument();
  });

  it('renders widget legend', () => {
    const widgetOptical = render(
      <WidgetOptical organizationID={1} storageLimit={'100.0'} />
    );
    const { getByText } = widgetOptical;

    expect(getByText('Documentos com OCR realizado')).toBeInTheDocument();
  });

  it('renders widget optical moved documents', () => {
    const widgetOptical = render(
      <WidgetOptical organizationID={1} storageLimit={'100.0'} />
    );
    const { getByText } = widgetOptical;

    expect(getByText('Documentos movidos')).toBeInTheDocument();
  });
});
