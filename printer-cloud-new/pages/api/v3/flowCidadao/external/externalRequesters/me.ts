import client from '../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { MeExternalRequesterAPIResponse } from '../../../../../../services/flow-cidadao/types';

const transformData = (data): MeExternalRequesterAPIResponse => {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    cpfCnpj: data.cpf_cnpj,
    birthDate: data.birth_date,
    phone: data.phone,
    optionalEmail: data.optional_email,
    optionalPhone: data.optional_phone,
    occupation: data.occupation,
    notification: data.notification,
    status: data.status,
    blocked: data.blocked,
    prn: data.prn,
    organizationId: data.organization_id,
    changedPassword: data.changed_password,
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
    .get(`/v3/printer_flow/external/external_requesters/me`, config)
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
