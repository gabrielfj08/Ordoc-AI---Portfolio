import * as React from 'react';
import { render } from '@testing-library/react';

import WidgetAir from './WidgetAir';

describe('WidgetAir', () => {
  it('renders widget title', () => {
    const widgetAir = render(
      <WidgetAir organizationID={1} storageLimit={'100.0'} />
    );
    const { getByText } = widgetAir;

    expect(getByText('AIR')).toBeInTheDocument();
  });

  it('renders widget legend', () => {
    const widgetAir = render(
      <WidgetAir organizationID={1} storageLimit={'100.0'} />
    );
    const { getByText } = widgetAir;

    expect(getByText('Armazenamento utilizado')).toBeInTheDocument();
  });

  it('renders widget directories', () => {
    const widgetAir = render(
      <WidgetAir organizationID={1} storageLimit={'100.0'} />
    );
    const { getByText } = widgetAir;

    expect(getByText('Diretórios')).toBeInTheDocument();
  });

  it('renders widget documents', () => {
    const widgetAir = render(
      <WidgetAir organizationID={1} storageLimit={'100.0'} />
    );
    const { getByText } = widgetAir;

    expect(getByText('Documentos')).toBeInTheDocument();
  });
});
