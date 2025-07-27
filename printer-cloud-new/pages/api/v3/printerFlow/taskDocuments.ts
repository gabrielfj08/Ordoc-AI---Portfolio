import client from '../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../utils';
import { IndexTaskDocumentsAPIResponse } from '../../../../services/printer-flow/types';

const transformData = (data): IndexTaskDocumentsAPIResponse => {
  return {
    taskDocuments: data['printer_flow/task_documents'].map(
      (taskDocumentData) => {
        return {
          id: taskDocumentData.id,
          status: taskDocumentData.status,
          taskId: taskDocumentData.task_id,
          s3Key: taskDocumentData.s3_key,
          name: taskDocumentData.name,
          signedDocumentId: taskDocumentData.signed_document_id,
          documentId: taskDocumentData.document_id,
          createdById: taskDocumentData.created_by_id,
          createdAt: taskDocumentData.created_at,
          updatedAt: taskDocumentData.updated_at,
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

  queryString = queryString.replace('status=failed', 'status[]=failed');
  queryString = queryString.replace('status=created', 'status[]=created');
  queryString = queryString.replace('status=running', 'status[]=running');
  queryString = queryString.replace('status=finished', 'status[]=finished');

  return client
    .get(`/v3/printer_flow/task_documents?${queryString}`, config)
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
