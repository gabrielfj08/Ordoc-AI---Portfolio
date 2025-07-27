import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../../client';
import { camelToSnake } from '../../../../../../../utils';
import {
  DeleteTaskFieldAPIResponse,
  ShowTaskFieldAPIResponse,
  UpdateTaskFieldAPIResponse,
} from '../../../../../../../services/printer-flow/types';

const transformDeleteData = (data): DeleteTaskFieldAPIResponse => {
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

const transformShowData = (data): ShowTaskFieldAPIResponse => {
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

const transformUpdateData = (data): UpdateTaskFieldAPIResponse => {
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

  switch (req.method) {
    case 'GET':
      return client
        .get(
          `/v3/printer_flow/task_templates/${req.query.taskTemplateId}/task_fields/${req.query.taskFieldId}`,
          config
        )
        .then((response) => {
          res.status(response.status).json(transformShowData(response.data));
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

    case 'PUT':
      return client
        .put(
          `/v3/printer_flow/task_templates/${req.query.taskTemplateId}/task_fields/${req.query.taskFieldId}`,
          {
            label: req.body.label,
            options: req.body.options.map((option) => option),
            field_type: req.body.fieldType,
          },
          config
        )
        .then((response) => {
          res.status(response.status).json(transformUpdateData(response.data));
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

    case 'DELETE':
      return client
        .delete(
          `/v3/printer_flow/task_templates/${req.query.taskTemplateId}/task_fields/${req.query.taskFieldId}`,
          config
        )
        .then((response) => {
          res.status(response.status).json(transformDeleteData(response.data));
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
