import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../client';
import { camelToSnake } from '../../../../utils';
import {
  BaseFieldDocumentTemplate,
  IndexFieldDocumentTemplates,
} from '../../../../services/printer-flow/types';

const transformCreateData = (data): BaseFieldDocumentTemplate => {
  return {
    id: data.id,
    name: data.name,
    status: data.status,
    organizationId: data.organization_id,
    s3Key: data.s3_key,
    documentId: data.document_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    documentUrl: data.document_url,
  };
};

const transformIndexData = (data): IndexFieldDocumentTemplates => {
  return {
    fieldDocumentTemplates: data['printer_flow/field_document_templates'].map(
      (fieldDocumentTemplate) => {
        return {
          id: fieldDocumentTemplate.id,
          name: fieldDocumentTemplate.name,
          status: fieldDocumentTemplate.status,
          organizationId: fieldDocumentTemplate.organization_id,
          s3Key: fieldDocumentTemplate.s3_key,
          documentId: fieldDocumentTemplate.document_id,
          createdAt: fieldDocumentTemplate.created_at,
          updatedAt: fieldDocumentTemplate.updated_at,
        };
      }
    ),
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

  const queryString = new URLSearchParams(
    camelToSnake(req.query) as Record<string, string>
  ).toString();

  switch (req.method) {
    case 'GET':
      return client
        .get(`/v3/printer_flow/field_document_templates?${queryString}`, config)
        .then((response) => {
          res.status(response.status).json(transformIndexData(response.data));
        })
        .catch((error) => {
          res.status(error.response.status).json(error.response.data);
        });
    case 'POST':
      return client
        .post(
          `/v3/printer_flow/field_document_templates`,
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
