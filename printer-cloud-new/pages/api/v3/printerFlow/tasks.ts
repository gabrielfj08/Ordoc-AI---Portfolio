import client from '../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../utils';
import { IndexTasksAPIResponse } from '../../../../services/printer-flow/types';
import { CreateTaskPayload } from '../../../../services/printer-flow/types/task';
import TaskCommentList from '../../../../PrinterFlow/Tasks/TaskComments/CommentList/CommentList';

const transformCreateData = (data): CreateTaskPayload => {
  return {
    name: data.name,
    description: data.description,
    procedureId: data.procedure_id,
  };
};

const transformData = (data): IndexTasksAPIResponse => {
  return {
    tasks: data['printer_flow/tasks'].map((taskData) => {
      return {
        id: taskData.id,
        deadline: taskData.deadline,
        priority: taskData.priority,
        prn: taskData.prn,
        groupAssigneeId: taskData.group_assignee_id,
        procedureId: taskData.procedure_id,
        name: taskData.name,
        description: taskData.description,
        assigneeId: taskData.assignee_id,
        createdById: taskData.created_by_id,
        status: taskData.status,
        createdAt: taskData.created_at,
        updatedAt: taskData.updated_at,
        procedureInfo: taskData.procedure_info,
        assignee: taskData.assignee
          ? {
              id: taskData.assignee.id,
              name: taskData.assignee.name,
              organizationId: taskData.assignee.organization_id,
              parentGroupId: taskData.assignee.parent_group_id,
              cpfCnpj: taskData.assignee.cpf_cnpj,
              prn: taskData.assignee.prn,
              code: taskData.assignee.code,
              email: taskData.assignee.email,
              optionalEmail: taskData.assignee.optional_email,
              type: taskData.assignee.type,
              status: taskData.assignee.status,
              phone: taskData.assignee.phone,
              optionalPhone: taskData.assignee.optional_phone,
              occupation: taskData.assignee.occupation,
              birthDate: taskData.assignee.birth_date,
              createdAt: taskData.assignee.created_at,
              updatedAt: taskData.assignee.updated_at,
            }
          : null,
        groupAssignee: taskData.group_assignee
          ? {
              id: taskData.group_assignee.id,
              name: taskData.group_assignee.name,
              parentGroupId: taskData.group_assignee.parent_group_id,
              prn: taskData.group_assignee.prn,
              code: taskData.group_assignee.code,
              status: taskData.group_assignee.status,
              createdAt: taskData.group_assignee.created_at,
              updatedAt: taskData.group_assignee.updated_at,
            }
          : null,
        procedure: {
          id: taskData.procedure.id,
          deadline: taskData.procedure.deadline || null,
          priority: taskData.procedure.priority,
          private: taskData.procedure.private,
          prn: taskData.procedure.prn,
          organizationId: taskData.procedure.organization_id,
          processNumber: taskData.procedure.process_number,
          responsibleGroupId: taskData.procedure.responsible_group_id,
          requesterId: taskData.procedure.requester_id,
          createdById: taskData.procedure.created_by_id,
          procedureTemplateName: taskData.procedure.procedure_template_name,
          procedureTemplateId: taskData.procedure.procedure_template_id,
          source: taskData.procedure.source,
          status: taskData.procedure.status,
          schema: taskData.procedure.schema.map((schemaItem) => {
            return {
              label: schemaItem.label,
              fieldType: schemaItem.field_type,
              options: schemaItem.options,
            };
          }),

          payload: taskData.procedure.payload.map((payloadItem) => {
            return {
              label: payloadItem.label,
              fieldType: payloadItem.field_type,
              options: payloadItem.options,
              value: payloadItem.value,
            };
          }),

          createdAt: taskData.procedure.created_at,
          updatedAt: taskData.procedure.updated_at,
        },
      };
    }),
    meta: {
      total: data.meta.total,
    },
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = {
    headers: {
      Authorization: `Bearer ${req.headers.token}`,
      'X-Api-Subdomain': req.headers['x-api-subdomain'] as string,
      'X-Forwarded-For': req.headers['x-forwarded-for']
        ? (req.headers['x-forwarded-for'] as string).split(',')[0]
        : req.headers['x-real-ip']
        ? (req.headers['x-real-ip'] as string)
        : (req.socket.remoteAddress as string),
    },
  };

  let queryString = new URLSearchParams(
    camelToSnake(req.query) as Record<string, string>
  ).toString();

  queryString = queryString.replace(
    'status=doneByMe',
    'status[]=refused&status[]=finished'
  );
  queryString = queryString.replace('status=draft', 'status[]=draft');
  queryString = queryString.replace('status=running', 'status[]=running');
  queryString = queryString.replace('status=started', 'status[]=started');
  queryString = queryString.replace('status=finished', 'status[]=finished');
  queryString = queryString.replace('status=refused', 'status[]=refused');
  queryString = queryString.replace('priority=normal', 'priority[]=normal');
  queryString = queryString.replace('priority=high', 'priority[]=high');

  switch (req.method) {
    case 'GET':
      return client
        .get(`/v3/printer_flow/tasks?${queryString}`, config)
        .then((response) => {
          res.status(response.status).json(transformData(response.data));
        })
        .catch((error) => {
          if (error.response?.data?.message) {
            res.status(error.response.status).json(error.response.data);
          } else {
            res.status(error.response?.status || 500).json({
              message:
                'Um erro inesperado ocorreu. Tente novamente mais tarde.',
            });
          }
        });

    case 'POST':
      return client
        .post(`/v3/printer_flow/tasks`, camelToSnake(req.body), config)
        .then((response) => {
          res.status(response.status).json(transformCreateData(response.data));
        })
        .catch((error) => {
          if (error.response?.data?.message) {
            res.status(error.response.status).json(error.response.data);
          } else {
            res.status(error.response?.status || 500).json({
              message:
                'Um erro inesperado ocorreu. Tente novamente mais tarde.',
            });
          }
        });
  }
}
