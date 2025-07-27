import client from '../../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../../../../utils';
import { BaseField } from '../../../../../../../services/printer-flow/types';

const transformData = (data): BaseField => {
  return {
    id: data.id,
    label: data.label,
    procedureTemplateId: data.procedure_template_id,
    fieldType: data.field_type,
    required: data.required,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    fieldDocumentTemplate: data.field_document_template,
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
    case 'PUT':
      return client
        .put(
          `/v3/printer_flow/procedure_templates/${req.query.id}/fields/${req.query.fieldId}`,
          camelToSnake(req.body),
          config
        )
        .then((response) => {
          res.status(response.status).json(transformData(response.data));
        })
        .catch((error) => {
          if (error.response.data.message) {
            res.status(error.response.status).json(error.response.data);
          } else {
            res.status(error.response.status || 500).json({
              message:
                'Um erro inesperado ocorreu. Tente novamente mais tarde.',
            });
          }
        });
    case 'DELETE':
      return client
        .delete(
          `/v3/printer_flow/procedure_templates/${req.query.id}/fields/${req.query.fieldId}`,
          config
        )
        .then((response) => {
          res.status(response.status).json(response.data);
        })
        .catch((error) => {
          if (error.response.data.message) {
            res.status(error.response.status).json(error.response.data);
          } else {
            res.status(error.response.status || 500).json({
              message:
                'Um erro inesperado ocorreu. Tente novamente mais tarde.',
            });
          }
        });
  }
}
