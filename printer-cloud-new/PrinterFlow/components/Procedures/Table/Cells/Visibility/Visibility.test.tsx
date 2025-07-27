import * as React from 'react';
import { render } from '@testing-library/react';
import { IndexProcedure } from '../../../../../../services/printer-flow/types';
import VisibilityCell from './Visibility';

const testProcedure: IndexProcedure = {
  id: 1,
  deadline: '2023-10-20',
  priority: 'normal',
  private: false,
  prn: 'prn:printer_flow:04916444000122:Protocolo/1/2023',
  organizationId: 1,
  processNumber: '1/2023',
  responsibleGroupId: 1,
  requesterId: 1,
  createdById: 4,
  procedureTemplateName: 'Protocolo',
  procedureTemplateId: 1,
  source: 'internal',
  status: 'draft',
  schema: [],
  payload: [],
  createdAt: '2023-04-12T12:37:05.076Z',
  updatedAt: '2023-04-12T12:37:05.076Z',
};

describe('Visibility table cell', () => {
  it('renders the Visibility cell', () => {
    render(<VisibilityCell procedure={testProcedure} />);
  });
});
