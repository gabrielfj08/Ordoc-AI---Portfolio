import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../client';
import { ActivateTaskTemplateAPIResponse } from '../../../../../../services/printer-flow/types';

const transformData = (data): ActivateTaskTemplateAPIResponse => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    status: data.status,
    organizationId: data.organization_id,
    prn: data.prn,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    procedureCount: data.procedure_count,
    taskFields: data.task_fields.length
      ? data.task_fields.map((taskField) => {
          return {
            id: taskField.id,
            fieldableType: taskField.fieldable_type,
            fieldableId: taskField.fieldable_id,
            fieldType: taskField.field_type,
            label: taskField.label,
            value: taskField.value,
            arrayValues: taskField.array_values,
            options: taskField.options,
            createdAt: taskField.created_at,
            updatedAt: taskField.updated_at,
          };
        })
      : [],
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

  return client
    .put(
      `/v3/printer_flow/task_templates/${req.query.taskTemplateId}/activate`,
      {},
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
          message: 'Um erro inesperado ocorreu. Tente novamente mais tarde.',
        });
      }
    });
}
