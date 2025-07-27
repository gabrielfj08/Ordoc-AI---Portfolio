import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../client';
import { ShowDocumentUploadJobAPIResponse } from '../../../../../services/printer-air/types';

const transformShowData = (data): ShowDocumentUploadJobAPIResponse => {
  return {
    id: data.id,
    status: data.status,
    s3Key: data.s3_key,
    description: data.description,
    location: data.location,
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
    .get(`/v3/printer_air/document_upload_jobs/${req.query.id}`, config)
    .then((response) => {
      res.status(response.status).json(transformShowData(response.data));
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
