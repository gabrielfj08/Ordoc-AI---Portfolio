import * as React from 'react';
import { render } from '@testing-library/react';
import { IndexTaskTemplate } from '../../../../../../services/printer-flow/types';
import TaskTemplateDescriptionCell from './Description';

const testTaskTemplate: IndexTaskTemplate = {
  id: 1,
  name: 'Ordem de serviço',
  description: 'Preencher todos os campos da OS',
  status: 'active',
  organizationId: 1,
  prn: 'prn:printer_flow:04916444000122:task_template/Ordem de Servico',
  createdAt: '2023-04-12T12:37:05.076Z',
  updatedAt: '2023-04-12T12:37:05.076Z',
};

describe('Task Template table cell', () => {
  it('renders the TaskTemplateDescription cell', () => {
    const descriptionCell = render(
      <TaskTemplateDescriptionCell taskTemplate={testTaskTemplate} />
    );

    const { getAllByText } = descriptionCell;

    expect(getAllByText('Preencher todos os campos da OS')[0]).toBeInTheDocument();
  });
});
