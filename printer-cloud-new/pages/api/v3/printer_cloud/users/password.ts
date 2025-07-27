import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../client';
import {
  GenerateOtpAPIResponse,
  ResetPasswordAPIResponse,
} from '../../../../../services/types';
import { camelToSnake } from '../../../../../utils';

const transformGenerateOTPData = (data): GenerateOtpAPIResponse => {
  return { message: data.message };
};

const transformResetPasswordData = (data): ResetPasswordAPIResponse => {
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
    changedPassword: data.changed_password,
    registrationNumber: data.registration_number,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    deletedAt: data.deleted_at,
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = {
    headers: {
      'X-Api-Subdomain': req.headers['x-api-subdomain'] as string,
      'X-Forwarded-For': req.headers['x-forwarded-for']
        ? (req.headers['x-forwarded-for'] as string).split(',')[0]
        : req.headers['x-real-ip']
        ? (req.headers['x-real-ip'] as string)
        : (req.socket.remoteAddress as string),
    },
  };

  switch (req.method) {
    case 'POST':
      return client
        .post(`/v3/printer_cloud/users/password`, req.body, config)
        .then((response) => {
          res
            .status(response.status)
            .json(transformGenerateOTPData(response.data));
        })
        .catch((error) => {
          res.status(error.response.status).json(error.response.data);
        });
    case 'PUT':
      return client
        .put(`/v3/printer_cloud/users/password`, camelToSnake(req.body), config)
        .then((response) => {
          res
            .status(response.status)
            .json(transformResetPasswordData(response.data));
        })
        .catch((error) => {
          res.status(error.response.status).json(error.response.data);
        });
  }
}
