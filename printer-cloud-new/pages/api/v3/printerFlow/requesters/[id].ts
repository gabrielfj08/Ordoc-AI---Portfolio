import client from '../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../../utils';
import {
  ShowRequesterAPIResponse,
  UpdateRequesterAPIResponse,
} from '../../../../../services/printer-flow/types';

const transformShowData = (data): ShowRequesterAPIResponse => {
  return {
    id: data.id,
    name: data.name,
    organizationId: data.organization_id,
    parentGroupId: null,
    cpfCnpj: data.cpf_cnpj,
    prn: data.prn,
    code: null,
    email: data.email,
    optionalEmail: data.optional_email ? data.optional_email : null,
    type: data.type,
    status: data.status,
    phone: data.phone,
    optionalPhone: data.optional_phone ? data.optional_phone : null,
    occupation: data.occupation ? data.occupation : null,
    birthDate: data.birth_date,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    user: data.user
      ? {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          cpf: data.user.cpf,
          dateOfBirth: data.user.date_of_birth,
          avatarUrl: data.user.avatar_url,
          phone: data.user.phone,
          prn: data.user.prn,
          status: data.user.status,
          username: data.user.user_name,
          changedPassword: data.user.changed_password,
          registrationNumber: data.user.registration_number,
          createdAt: data.user.created_at,
          updatedAt: data.user.updated_at,
          deletedAt: data.user.deleted_at,
        }
      : null,
    address: data.address
      ? {
          id: data.address.id,
          street: data.address.street,
          number: data.address.number,
          complement: data.address.complement,
          postalCode: data.address.postal_code,
          city: data.address.city,
          state: data.address.state,
          neighborhood: data.address.neighborhood,
          createdAt: data.address.created_at,
          updatedAt: data.address.updated_at,
          deletedAt: data.address.deleted_at,
        }
      : null,
  };
};

const transformUpdateData = (data): UpdateRequesterAPIResponse => {
  return {
    name: data.name,
    cpfCnpj: data.cpf_cnpj,
    phone: data.phone,
    email: data.email,
    birthDate: data.birth_date,
    optionalPhone: data.optional_phone,
    optionalEmail: data.optional_email,
    occupation: data.occupation,
    address: {
      street: data.address.street,
      number: data.address.number,
      complement: data.address.complement,
      postalCode: data.address.postal_code,
      city: data.address.city,
      state: data.address.state,
      neighborhood: data.address.neighborhood,
    },
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

  const queryString = new URLSearchParams(
    req.query as Record<string, string>
  ).toString();

  switch (req.method) {
    case 'PUT':
      return client
        .put(
          `/v3/printer_flow/requesters/${req.query.id}`,
          camelToSnake(req.body),
          config
        )
        .then((response) => {
          res.status(response.status).json(transformUpdateData(response.data));
        })
        .catch((error) => {
          res.status(error.response.status).json(error.response.data);
        });
    case 'GET':
      return client
        .get(`/v3/printer_flow/requesters/${req.query.id}`, config)
        .then((response) => {
          res.status(response.status).json(transformShowData(response.data));
        })
        .catch((error) => {
          res.status(error.response.status).json(error.response.data);
        });

    // case 'POST':
  }
}
