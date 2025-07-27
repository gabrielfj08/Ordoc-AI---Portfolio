import client from '../../../../../client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { IndexExternalTasksAPIResponse } from '../../../../../services/flow-cidadao/types';
import { camelToSnake } from '../../../../../utils';

const transformIndexData = (data): IndexExternalTasksAPIResponse => {
  return {
    tasks: data['printer_flow/tasks'].map((taskData) => {
      return {
        id: taskData.id,
        procedureId: taskData.procedure_id,
        name: taskData.name,
        description: taskData.description,
        status: taskData.status,
        createdById: taskData.created_by_id,
        createdAt: taskData.created_at,
        updatedAt: taskData.updated_at,
        procedureInfo: taskData.procedure_info,
        createdBy: {
          id: taskData.created_by.id,
          name: taskData.created_by.name,
          email: taskData.created_by.email,
          cpf: taskData.created_by.cpf,
          dateOfBirth: taskData.created_by.date_of_birth,
          avatarUrl: taskData.created_by.avatar_url,
          organizationId: taskData.created_by.organization_id,
          phone: taskData.created_by.phone,
          prn: taskData.created_by.prn,
          status: taskData.created_by.status,
          username: taskData.created_by.username,
          changedPassword: taskData.created_by.changed_password,
          registrationNumber: taskData.created_by.registration_number,
          createdAt: taskData.created_by.created_at,
          updatedAt: taskData.created_by.updated_at,
          deletedAt: taskData.created_by.deleted_at,
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

  queryString = queryString.replace('status=draft', 'status[]=draft');
  queryString = queryString.replace('status=running', 'status[]=running');
  queryString = queryString.replace('status=started', 'status[]=started');
  queryString = queryString.replace('status=finished', 'status[]=finished');
  queryString = queryString.replace('status=refused', 'status[]=refused');

  switch (req.method) {
    case 'GET':
      return client
        .get(`/v3/printer_flow/external/tasks?${queryString}`, config)
        .then((response) => {
          res.status(response.status).json(transformIndexData(response.data));
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
