import client from '../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../../../utils';
import {
  BaseProcedureTemplateDocument,
  IndexProcedureTemplateDocuments,
} from '../../../../../../services/printer-flow/types/procedureTemplateDocument';

const transformIndexData = (data): IndexProcedureTemplateDocuments => {
  return {
    procedureTemplateDocuments: data[
      'printer_flow/procedure_template_documents'
    ].map((procedureTemplateDocumentData) => {
      return {
        id: procedureTemplateDocumentData.id,
        name: procedureTemplateDocumentData.name,
        status: procedureTemplateDocumentData.status,
        procedureTemplateId:
          procedureTemplateDocumentData.procedure_template_id,
        s3Key: procedureTemplateDocumentData.s3_key,
        documentId: procedureTemplateDocumentData.document_id,
        createdById: procedureTemplateDocumentData.created_by_id,
        createdAt: procedureTemplateDocumentData.created_at,
        updatedAt: procedureTemplateDocumentData.updated_at,
      };
    }),
    meta: {
      total: data.meta.total,
    },
  };
};

const transformCreateData = (data): BaseProcedureTemplateDocument => {
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
        .get(
          `/v3/printer_flow/procedure_templates/${req.query.id}/procedure_template_documents?${queryString}`,
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
          `/v3/printer_flow/procedure_templates/${req.query.id}/procedure_template_documents`,
          { procedure_template_document: camelToSnake(req.body) },
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
