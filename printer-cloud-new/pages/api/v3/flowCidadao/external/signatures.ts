import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../client';
import { camelToSnake } from '../../../../../utils';
import { IndexExternalSignaturesAPIResponse } from '../../../../../services/flow-cidadao/types';

const transformData = (data): IndexExternalSignaturesAPIResponse => {
  return {
    signatures: data['printer_sign/signatures'].map((signatureData) => {
      return {
        id: signatureData.id,
        signableId: signatureData.signable_id,
        signableType: signatureData.signable_type,
        requesterId: signatureData.requester_id,
        status: signatureData.status,
        service: signatureData.service,
        token: signatureData.token,
        procedureId: signatureData.procedure_id,
        createdById: signatureData.created_by_id,
        createdAt: signatureData.created_at,
        updatedAt: signatureData.created_at,
        signable: {
          id: signatureData.signable.id,
          status: signatureData.signable.status,
          taskId: signatureData.signable.task_id,
          s3Key: signatureData.signable.s3_key,
          name: signatureData.signable.name,
          signedDocumentId: signatureData.signable.signed_document_id || null,
          documentId: signatureData.signable.document_id,
          createdById: signatureData.signable.created_by_id,
          createdAt: signatureData.signable.created_at,
          updatedAt: signatureData.signable.updated_at,
          documentUrl: signatureData.signable.document_url,
        },
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

  if (!req.query.createdAtGte) delete req.query.createdAtGte;
  if (!req.query.createdAtLte) delete req.query.createdAtLte;

  let queryString = new URLSearchParams(
    camelToSnake(req.query) as Record<string, string>
  ).toString();

  queryString = queryString.replace('created_at_lte', 'created_at[lte]');
  queryString = queryString.replace('created_at_gte', 'created_at[gte]');
  queryString = queryString.replace('status=created', 'status[]=created');
  queryString = queryString.replace('status=signed', 'status[]=signed');
  queryString = queryString.replace('status=running', 'status[]=running');
  queryString = queryString.replace('status=refused', 'status[]=refused');
  queryString = queryString.replace(
    'status=allStatus',
    'status[]=created&status[]=refused&status[]=signed&status[]=running'
  );

  return client
    .get(`/v3/printer_flow/external/signatures?${queryString}`, config)
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
