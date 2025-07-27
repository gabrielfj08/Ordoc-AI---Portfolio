import client from '../../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../../../../utils';
import {
  CreateProcedureDocumentAPIResponse,
  IndexProcedureDocumentsAPIResponse,
} from '../../../../../../../services/flow-cidadao/types';

const transformCreateData = (data): CreateProcedureDocumentAPIResponse => {
  return {
    id: data.id,
    status: data.status,
    procedureId: data.procedure_id,
    s3Key: data.s3_key,
    name: data.name,
    signedDocumentId: data.signed_document_id,
    documentId: data.document_id,
    uuid: data.uuid,
    createdById: data.created_by_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    documentUrl: data.document_url,
  };
};

const transformIndexData = (data): IndexProcedureDocumentsAPIResponse => {
  return {
    procedureDocuments: data['printer_flow/procedure_documents'].map(
      (procedureDocumentData) => {
        return {
          id: procedureDocumentData.id,
          status: procedureDocumentData.status,
          procedureId: procedureDocumentData.procedure_id,
          s3Key: procedureDocumentData.s3_key,
          name: procedureDocumentData.name,
          signedDocumentId: procedureDocumentData.signed_document_id,
          documentId: procedureDocumentData.document_id,
          uuid: procedureDocumentData.uuid,
          createdById: procedureDocumentData.created_by_id,
          createdAt: procedureDocumentData.created_at,
          updatedAt: procedureDocumentData.updated_at,
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

  let queryString = new URLSearchParams(
    camelToSnake(req.query) as Record<string, string>
  ).toString();

  queryString = queryString.replace('status=created', 'status[]=created');
  queryString = queryString.replace('status=running', 'status[]=running');
  queryString = queryString.replace('status=finished', 'status[]=finished');
  queryString = queryString.replace('status=failed', 'status[]=failed');

  switch (req.method) {
    case 'GET':
      return client
        .get(
          `/v3/printer_flow/external/procedures/${req.query.procedureId}/procedure_documents?${queryString}`,
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
          `/v3/printer_flow/external/procedures/${req.query.procedureId}/procedure_documents`,
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
