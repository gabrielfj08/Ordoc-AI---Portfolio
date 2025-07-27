import * as React from 'react';
import { render } from '@testing-library/react';

import WidgetFlow from './WidgetFlow';

describe('WidgetFlow', () => {
  it('renders widget title', () => {
    const widgetFlow = render(
      <WidgetFlow organizationID={1} storageLimit={'100.0'} />
    );
    const { getByText } = widgetFlow;

    expect(getByText('FLOW')).toBeInTheDocument();
  });

  it('renders widget legend', () => {
    const widgetFlow = render(
      <WidgetFlow organizationID={1} storageLimit={'100.0'} />
    );
    const { getByText } = widgetFlow;

    expect(getByText('Armazenamento utilizado')).toBeInTheDocument();
  });

  it('renders widget signed documents', () => {
    const widgetFlow = render(
      <WidgetFlow organizationID={1} storageLimit={'100.0'} />
    );
    const { getByText } = widgetFlow;

    expect(getByText('Documentos assinados')).toBeInTheDocument();
  });

  it('renders widget started procedures', () => {
    const widgetFlow = render(
      <WidgetFlow organizationID={1} storageLimit={'100.0'} />
    );
    const { getByText } = widgetFlow;

    expect(getByText('Processos tramitando')).toBeInTheDocument();
  });

  it('renders widget archived procedures', () => {
    const widgetFlow = render(
      <WidgetFlow organizationID={1} storageLimit={'100.0'} />
    );
    const { getByText } = widgetFlow;

    expect(getByText('Processos arquivados')).toBeInTheDocument();
  });
});
