import client from '../../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../../../../utils';
import {
  CreateExternalTaskCommentAPIResponse,
  IndexExternalTaskCommentsAPIResponse,
} from '../../../../../../../services/flow-cidadao/types';

const transformCreateData = (data): CreateExternalTaskCommentAPIResponse => {
  return {
    id: data.id,
    body: data.body,
    taskId: data.task_id,
    createdById: data.created_by_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    createdBy: {
      id: data.created_by.id,
      name: data.created_by.name,
      organizationId: data.created_by.organization_id,
      parentGroupId: data.created_by.parent_group_id,
      cpfCnpj: data.created_by.cpf_cnpj,
      prn: data.created_by.prn,
      code: data.created_by.code,
      email: data.created_by.email,
      optionalEmail: data.created_by.optional_email,
      type: data.created_by.type,
      status: data.created_by.status,
      blocked: data.created_by.blocked,
      phone: data.created_by.phone,
      optionalPhone: data.created_by.optional_phone,
      occupation: data.created_by.occupation,
      birthDate: data.created_by.birth_date,
      createdAt: data.created_by.created_at,
      updatedAt: data.created_by.updated_at,
    },
  };
};

const transformData = (data): IndexExternalTaskCommentsAPIResponse => {
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
          `/v3/printer_flow/external/tasks/${req.query.taskId}/task_comments?${queryString}`,
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
          `/v3/printer_flow/external/tasks/${req.query.taskId}/task_comments`,
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
