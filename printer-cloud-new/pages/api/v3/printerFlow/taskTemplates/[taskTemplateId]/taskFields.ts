import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../client';
import { camelToSnake } from '../../../../../../utils';
import {
  CreateTaskFieldAPIResponse,
  IndexTaskFieldsAPIResponse,
} from '../../../../../../services/printer-flow/types';

const transformCreateData = (data): CreateTaskFieldAPIResponse => {
  return {
    id: data.id,
    label: data.label,
    fieldableType: data.fieldable_type,
    fieldableId: data.fieldable_id,
    fieldType: data.field_type,
    options: data.options,
    value: data.value ? data.value : null,
    arrayValues: data.array_values,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

const transformIndexData = (data): IndexTaskFieldsAPIResponse => {
  return {
    taskFields: data['printer_flow/task_fields'].map((taskFieldData) => {
      return {
        id: taskFieldData.id,
        label: taskFieldData.label,
        fieldableType: taskFieldData.fieldable_type,
        fieldableId: taskFieldData.fieldable_id,
        fieldType: taskFieldData.field_type,
        options: taskFieldData.options,
        value: taskFieldData.value ? taskFieldData.value : null,
        arrayValues: taskFieldData.array_values,
        createdAt: taskFieldData.created_at,
        updatedAt: taskFieldData.updated_at,
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

  switch (req.method) {
    case 'GET':
      return client
        .get(
          `/v3/printer_flow/task_templates/${req.query.taskTemplateId}/task_fields?${queryString}`,
          config
        )
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

    case 'POST':
      return client
        .post(
          `/v3/printer_flow/task_templates/${req.query.taskTemplateId}/task_fields`,
          {
            label: req.body.label,
            options: req.body.options.map((option) => option),
            field_type: req.body.fieldType,
          },
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
