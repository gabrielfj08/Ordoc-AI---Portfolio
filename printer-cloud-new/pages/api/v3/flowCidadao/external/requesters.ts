import client from '../../../../../client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { CreateExternalRequesterAPIResponse } from '../../../../../services/flow-cidadao/types';

const transformData = (data): CreateExternalRequesterAPIResponse => {
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
    address: {
      id: data.address.id,
      street: data.address.street,
      number: data.address.number,
      complement: data.address.complement,
      city: data.address.city,
      state: data.address.state,
      postalCode: data.address.postal_code,
      neighborhood: data.address.neighborhood,
      createdAt: data.address.created_at,
      updatedAt: data.address.updated_at,
    },
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

  return client
    .post(
      `/v3/printer_flow/external/requesters`,
      {
        name: req.body.name,
        cpf_cnpj: req.body.cpfCnpj.replace(/[^0-9]/g, ''),
        email: req.body.email,
        birth_date: req.body.birthDate,
        phone: req.body.phone.replace(/[^0-9]/g, ''),
        optional_phone: req.body.optionalPhone.replace(/[^0-9]/g, ''),
        optional_email: req.body.optionalEmail,
        occupation: req.body.occupation,
        notification: req.body.notification,
        address: {
          street: req.body.address.street,
          number: req.body.address.number,
          complement: req.body.address.complement,
          city: req.body.address.city,
          state: req.body.address.state,
          postal_code: req.body.address.postalCode.replace(/[^0-9]/g, ''),
          neighborhood: req.body.address.neighborhood,
        },
      },
      config
    )
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
