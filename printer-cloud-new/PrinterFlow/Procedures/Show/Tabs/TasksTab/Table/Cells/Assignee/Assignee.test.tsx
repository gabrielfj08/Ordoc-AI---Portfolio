import * as React from 'react';
import { render } from '@testing-library/react';
import { IndexTask } from '../../../../../../../../services/printer-flow/types';
import AssigneeCell from './Assignee';

const testTask: IndexTask = {
  id: 1,
  deadline: '2023-10-20',
  priority: 'normal',
  prn: 'prn:printer_flow:04916444000122:Protocolo/1/2023',
  groupAssigneeId: 1,
  procedureId: 1,
  name: 'Assinar documento',
  description: 'Assina este documento para prosseguir com o processo',
  assigneeId: 1,
  createdById: 4,
  status: 'draft',
  createdAt: '2023-04-12T12:37:05.076Z',
  updatedAt: '2023-04-12T12:37:05.076Z',
  procedureInfo: '01/2023 - Protocolos',
  assignee: {
    id: 2,
    name: 'User Printer Cloud',
    organizationId: 1,
    parentGroupId: null,
    cpfCnpj: '23413593617',
    prn: 'prn:printer_flow:04916444000122:requester_internal/23413593617',
    code: null,
    email: 'fabianavitoriaramos@gmail.com',
    optionalEmail: null,
    type: 'PrinterFlow::InternalRequester',
    status: 'active',
    phone: '41987257639',
    optionalPhone: null,
    occupation: 'Suporte N1',
    birthDate: '1994-07-15',
    createdAt: '2023-03-24T12:09:40.477Z',
    updatedAt: '2023-03-24T12:09:40.477Z',
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
  groupAssignee: null,
};

describe('Assignee table cell', () => {
  it('renders the Assignee name cell', () => {
    const assigneeCell = render(<AssigneeCell task={testTask} />);

    const { getByText } = assigneeCell;

    expect(getByText('User Printer Cloud')).toBeInTheDocument();
  });
});
