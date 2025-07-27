import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../client';
import { ShowShareableLinkAPIResponse } from '../../../../../services/printer-air/types/shareableLink';

const transformShowData = (data): ShowShareableLinkAPIResponse => {
  return {
    id: data.id,
    uuid: data.uuid,
    expiresIn: data.expired_in,
    expiresAt: data.expired_at,
    documentPrn: data.document_prn,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    url: data.url,
    downloadUrl: data.download_url,
    byteSize: data.byte_size,
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return client
    .get(`/shareable_links/${req.query.uuid}`)
    .then((response) => {
      res.status(response.status).json(transformShowData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
