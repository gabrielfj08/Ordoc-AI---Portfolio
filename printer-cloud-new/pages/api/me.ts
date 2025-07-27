import client from '../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { MeAPIResponse } from '../../services/types/user';

const transformData = (data): MeAPIResponse => {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    changedPassword: data.changed_password,
    cpf: data.cpf,
    dateOfBirth: data.date_of_birth,
    avatarUrl: data.avatar_url,
    phone: data.phone,
    prn: data.prn,
    status: data.status,
    username: data.username,
    registrationNumber: data.registration_number,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    internalRequester: data.internal_requester
      ? {
          id: data.internal_requester.id,
          name: data.internal_requester.name,
          organizationId: data.internal_requester.organization_id,
          parentGroupId: data.internal_requester.parent_group_id,
          cpfCnpj: data.internal_requester.cpf_cnpj,
          prn: data.internal_requester.prn,
          code: data.internal_requester.code,
          email: data.internal_requester.email,
          optionalEmail: data.internal_requester.optional_email,
          type: data.internal_requester.type,
          status: data.internal_requester.status,
          phone: data.internal_requester.phone,
          optionalPhone: data.internal_requester.optional_phone,
          occupation: data.internal_requester.occupation,
          birthDate: data.internal_requester.birth_date,
          createdAt: data.internal_requester.created_at,
          updatedAt: data.internal_requester.updated_at,
        }
      : null,
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
    .get(`/v3/printer_cloud/me`, config)
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
