import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../../../utils';
import client from '../../../../../../client';
import { CreateTaskDocumentV4APIResponse } from '../../../../../../services/printer-flow/types';

const transformIndexData = (data): CreateTaskDocumentV4APIResponse => {
  return {
    id: data.id,
    status: data.status,
    taskId: data.task_id,
    key: data.key,
    source: data.source,
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
    .post(
      `/v4/printer_flow/tasks/${req.query.taskId}/task_documents`,
      req.body,
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
