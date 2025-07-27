import client from '../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../../../utils';
import {
  CreateTaskCommentAPIResponse,
  IndexTaskCommentsAPIResponse,
} from '../../../../../../services/printer-flow/types/taskComment';

const transformCreateData = (data): CreateTaskCommentAPIResponse => {
  return {
    id: data.id,
    body: data.body,
    taskId: data.task_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    createdById: {
      id: data.created_by_id.id,
      organizationId: data.created_by.organization_id,
      name: data.created_by.id,
      email: data.created_by.email,
      cpfCnpj: data.created_by.cpf_cnpj,
      status: data.created_by.status,
      prn: data.created_by.prn,
      createdAt: data.created_by.created_at,
      updatedAt: data.created_by.updated_at,
      code: data.created_by_id.code,
      parentGroupId: data.created_by_id.parent_group_id,
      phone: data.created_by.phone,
      optionalPhone: data.created_by.optional_phone,
      birthDate: data.created_by.birth_date,
      optionalEmail: data.created_by_id.optional_email,
      occupation: data.created_by_id.occupation,
    },
    task: {
      id: data.task.id,
      status: data.task.status,
      priority: data.task.priority,
      deadline: data.task.deadline,
      prn: data.task.prn,
      description: data.task.description,
      name: data.task.name,
      createdById: data.task.created_by_id,
      assigneeId: data.task.assignee_id,
      procedureId: data.task.procedure_id,
      groupAssigneeId: data.task.group_assignee_id,
      createdAt: data.task.created_at,
      updatedAt: data.task.updated_at,
    },
  };
};

const transformData = (data): IndexTaskCommentsAPIResponse => {
  return {
    taskComments: data['printer_flow/task_comments'].map((taskCommentData) => {
      return {
        id: taskCommentData.id,
        body: taskCommentData.body,
        taskId: taskCommentData.task_id,
        createdById: taskCommentData.created_by_id,
        createdAt: taskCommentData.created_at,
        updatedAt: taskCommentData.updated_at,
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
        .get(
          `/v3/printer_flow/tasks/${req.query.taskId}/task_comments?${queryString}`,
          config
        )
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
        .post(
          `/v3/printer_flow/tasks/${req.query.taskId}/task_comments`,
          camelToSnake(req.body),
          config
        )
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
