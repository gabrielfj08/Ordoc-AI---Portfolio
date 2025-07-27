import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../client';
import { ActivateRequesterAPIResponse } from '../../../../../../services/printer-flow/types';

const transformData = (data): ActivateRequesterAPIResponse => {
  return {
    id: data.id,
    name: data.name,
    organizationId: data.organization_id,
    parentGroupId: data.parent_group_id,
    cpfCnpj: data.cpf_cnpj,
    prn: data.prn,
    code: data.code,
    email: data.email,
    optionalEmail: data.optional_email,
    type: data.type,
    status: data.status,
    phone: data.phone,
    optionalPhone: data.optional_phone,
    occupation: data.occupation,
    birthDate: data.birth_date,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    address: data.address,
    user: data.user,
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
    .put(`/v3/printer_flow/requesters/${req.query.id}/activate`, {}, config)
    .then((response) => {
      res.status(response.status).json(transformData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
