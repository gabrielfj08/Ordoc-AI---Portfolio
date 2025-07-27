import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../client';
import { camelToSnake } from '../../../../../../utils';
import { CreateDocumentVersionUploadJobAPIResponse } from '../../../../../../services/printer-air/types';

const transformCreateData = (
  data
): CreateDocumentVersionUploadJobAPIResponse => {
  return {
    id: data.id,
    status: data.status,
    s3Key: data.s3_key,
    location: data.location,
    description: data.description,
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

  return client
    .post(
      `/v3/printer_air/documents/${req.query.documentId}/document_version_upload_jobs`,
      {
        document_version_upload_job: camelToSnake(req.body),
      },
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
          message: 'Um erro inesperado ocorreu. Tente novamente mais tarde.',
        });
      }
    });
}
