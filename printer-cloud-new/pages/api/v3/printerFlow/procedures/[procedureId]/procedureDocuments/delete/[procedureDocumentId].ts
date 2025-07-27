import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../../../client';
import { DeleteProcedureDocumentAPIResponse } from '../../../../../../../../services/printer-flow/types';

const transformData = (data): DeleteProcedureDocumentAPIResponse => {
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
    .delete(
      `/v3/printer_flow/procedures/${req.query.procedureId}/procedure_documents/${req.query.procedureDocumentId}`,
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
