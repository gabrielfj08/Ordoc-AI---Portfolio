import * as React from 'react';
import { render } from '@testing-library/react';
import { IndexTask } from '../../../../../../../../services/printer-flow/types';
import GroupAssigneeCell from './GroupAssignee';

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
  assignee: null,
  groupAssignee: {
    id: 1,
    name: 'Group requester',
    parentGroupId: 2,
    prn: 'prn:printer_flow:04916444000122:requester_group/Group requester',
    code: 1,
    status: 'active',
    createdAt: '2023-03-24T12:09:40.428Z',
    updatedAt: '2023-03-24T12:09:40.440Z',
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

describe('GroupAssignee table cell', () => {
  it('renders the GroupAssignee name cell', () => {
    const groupAssigneeCell = render(<GroupAssigneeCell task={testTask} />);

    const { getByText } = groupAssigneeCell;

    expect(getByText('Group requester')).toBeInTheDocument();
  });
});
