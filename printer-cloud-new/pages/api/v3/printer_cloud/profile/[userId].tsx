import client from '../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { UpdateUserAPIResponse } from '../../../../../services/types/user';

const transformData = (data) => {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    cpf: data.cpf,
    dateOfBirth: data.date_of_birth,
    avatarUrl: data.avatar_url,
    phone: data.phone,
    prn: data.prn,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    deletedAt: data.deleted_at,
  } as UpdateUserAPIResponse;
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
    .put(`/v3/printer_cloud/profile/${req.query.userId}`, config)
    .then((response) => {
      res.status(response.status).json(transformData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
