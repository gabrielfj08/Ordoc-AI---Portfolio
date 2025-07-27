import client from '../../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  BaseProcedureTemplateDocument,
  ShowProcedureTemplateDocument,
} from '../../../../../../../services/printer-flow/types/procedureTemplateDocument';

const transformData = (data): BaseProcedureTemplateDocument => {
  return {
    id: data.id,
    name: data.name,
    status: data.status,
    procedureTemplateId: data.procedure_template_id,
    s3Key: data.s3_key,
    documentId: data.document_id,
    createdById: data.created_by_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

const transformShowData = (data): ShowProcedureTemplateDocument => {
  return {
    id: data.id,
    name: data.name,
    status: data.status,
    procedureTemplateId: data.procedure_template_id,
    s3Key: data.s3_key,
    documentId: data.document_id,
    createdById: data.created_by_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    documentUrl: data.document_url,
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
          `/v3/printer_flow/procedure_templates/${req.query.id}/procedure_template_documents/${req.query.procedureTemplateDocumentId}`,
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

    case 'DELETE':
      return client
        .delete(
          `/v3/printer_flow/procedure_templates/${req.query.id}/procedure_template_documents/${req.query.procedureTemplateDocumentId}`,
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
  }
}
