import * as React from 'react';
import { render } from '@testing-library/react';
import { IndexTask } from '../../../../../../services/printer-flow/types';
import ProcedureCell from './Procedure';

const testTask: IndexTask = {
  id: 1,
  deadline: '2023-10-20',
  priority: 'normal',
  prn: 'prn:printer_flow:04916444000122:Protocolo/1/2023',
  groupAssigneeId: 1,
  procedureId: 1,
  procedureInfo: 'Protocolo - 5/2023',
  name: 'Solicitar foto',
  description: 'anexar documento depois de assinado',
  assigneeId: 4,
  createdById: 5,
  status: 'draft',
  createdAt: '2023-04-12T12:37:05.076Z',
  updatedAt: '2023-04-12T12:37:05.076Z',
  assignee: {
    id: 2,
    name: 'Catarina',
    organizationId: 1,
    parentGroupId: null,
    cpfCnpj: '012.014.032-15',
    prn: 'prn:printer_flow:04916444000122:Protocolo/1/2021',
    code: null,
    email: 'catarina.manteguinha@gamil.com',
    optionalEmail: null,
    type: 'PrinterFlow::InternalRequester',
    status: 'active',
    phone: '41988051203',
    optionalPhone: null,
    occupation: null,
    birthDate: '21/05/2000',
    createdAt: '2023-04-12T12:37:05.076Z',
    updatedAt: '2023-04-12T12:37:05.076Z',
  },
  groupAssignee: {
    id: 25,
    name: 'Grupinho da Lulu',
    parentGroupId: null,
    prn: 'prn:printer_flow:04916444000122:Protocolo/1/2022',
    code: 1250,
    status: 'inactive',
    createdAt: '2023-04-12T12:37:05.076Z',
    updatedAt: '2023-04-12T12:37:05.076Z',
  },
  procedure: {
    id: 2,
    deadline: null,
    priority: 'normal',
    private: false,
    prn: 'prn:printer_flow:04916444000122:Protocolo/1/2023',
    organizationId: 1,
    processNumber: '5/2023',
    responsibleGroupId: 23,
    requesterId: 23,
    createdById: 4,
    procedureTemplateName: 'Processinho',
    procedureTemplateId: 3,
    source: 'external',
    status: 'finished',
    schema: [],
    payload: [],
    createdAt: '2023-04-12T12:37:05.076Z',
    updatedAt: '2023-04-12T12:37:05.076Z',
  },
};

describe('procedure table cell', () => {
  it('renders the name cell', () => {
    const procedureCell = render(<ProcedureCell task={testTask} />);

    const { getByText } = procedureCell;

    expect(getByText('5/2023')).toBeInTheDocument();
  });
});
