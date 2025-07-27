import client from '../../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../../../../utils';
import { RefuseExternalSignatureAPIResponse } from '../../../../../../../services/flow-cidadao/types';

const transformData = (data): RefuseExternalSignatureAPIResponse => {
  return {
    id: data.id,
    signableId: data.signable_id,
    signableType: data.signable_type,
    requesterId: data.requester_id,
    status: data.status,
    service: data.service,
    token: data.token,
    procedureId: data.procedure_id || null,
    createdById: data.created_by_id || null,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    signable: {
      id: data.signable.id,
      status: data.signable.status,
      taskId: data.signable.task_id,
      s3Key: data.signable.s3_key,
      name: data.signable.name,
      signedDocumentId: data.signable.signed_document_id,
      documentId: data.signable.document_id,
      createdById: data.signable.created_by_id,
      createdAt: data.signable.created_at,
      updatedAt: data.signable.updated_at,
      documentUrl: data.signable.document_url,
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

  return client
    .put(
      `/v3/printer_flow/external/signatures/${req.query.signatureId}/refuse`,
      camelToSnake(req.body),
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
