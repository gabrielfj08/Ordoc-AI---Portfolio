import client from '../../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../../../../utils';
import { IndexExternalFieldsAPIResponse } from '../../../../../../../services/flow-cidadao/types';

const transformIndexData = (data): IndexExternalFieldsAPIResponse => {
  return {
    fields: data['printer_flow/fields'].map((fieldData) => {
      return {
        id: fieldData.id,
        label: fieldData.label,
        procedureTemplateId: fieldData.procedure_template_id,
        fieldType: fieldData.field_type,
        required: fieldData.required,
        createdAt: fieldData.created_at,
        updatedAt: fieldData.updated_at,
        fieldDocumentTemplate: fieldData.field_document_template
          ? {
              id: fieldData.field_document_template.id,
              name: fieldData.field_document_template.name,
              documentUrl: fieldData.field_document_template.document_url,
            }
          : null,
        fieldValueOptions: fieldData.field_value_options
          ? fieldData.field_value_options.map((option) => {
              return {
                id: option.id,
                fieldId: option.field_id,
                value: option.value,
                createdAt: option.created_at,
                updatedAt: option.updated_at,
              };
            })
          : [],
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
    'field_type=attachment',
    'field_type[]=attachment'
  );

  return client
    .get(
      `/v3/printer_flow/external/procedure_templates/${req.query.procedureTemplateId}/fields?${queryString}`,
      config
    )
    .then((response) => {
      res.status(response.status).json(transformIndexData(response.data));
    })
    .catch((error) => {
      if (error.response.data.message) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(error.response.status || 500).json({
          message: 'Um erro inesperado ocorreu. Tente novamente mais tarde.',
        });
      }
    });
}
