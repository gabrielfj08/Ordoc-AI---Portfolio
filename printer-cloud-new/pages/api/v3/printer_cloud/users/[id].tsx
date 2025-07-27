import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../client';
import { ShowUserAPIResponse } from '../../../../../services/types';

const transformShowData = (data): ShowUserAPIResponse => {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    cpf: data.cpf,
    dateOfBirth: data.date_of_birth,
    avatarUrl: data.avatar_url,
    organizationId: data.organization_id,
    phone: data.phone,
    prn: data.prn,
    status: data.status,
    username: data.username,
    registrationNumber: data.registration_number,
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

  switch (req.method) {
    case 'GET':
      return client
        .get(`/v3/printer_cloud/users/${req.query.id}`, config)
        .then((response) => {
          res.status(response.status).json(transformShowData(response.data));
        })
        .catch((error) => {
          res.status(error.response.status).json(error.response.data);
        });
    case 'PUT':
      return client
        .put(
          `/v3/printer_cloud/users/${req.query.id}`,
          {
            name: req.body.name,
            email: req.body.email,
            cpf: req.body.cpf,
            date_of_birth: req.body.dateOfBirth,
            avatar_url: req.body.avatarUrl,
            phone: req.body.phone,
            password: req.body.password,
            password_confirmation: req.body.passwordConfirmation,
            registration_number: req.body.registrationNumber,
          },
          config
        )
        .then((response) => {
          res.status(response.status).json(response.data);
        })
        .catch((error) => {
          res.status(error.response.status).json(error.response.data);
        });
    case 'DELETE':
      return client
        .delete(`/v3/printer_cloud/users/${req.query.id}`, config)
        .then((response) => {
          res.status(response.status).json(response.data);
        })
        .catch((error) => {
          res.status(error.response.status).json(error.response.data);
        });
    default:
      throw Error;
  }
}
