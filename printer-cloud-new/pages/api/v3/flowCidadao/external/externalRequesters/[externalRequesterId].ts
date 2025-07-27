import client from '../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  ShowExternalRequesterAPIResponse,
  UpdateExternalRequesterAPIResponse,
} from '../../../../../../services/flow-cidadao/types';
import { camelToSnake } from '../../../../../../utils';

const transformShowData = (data): ShowExternalRequesterAPIResponse => {
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

const transformUpdateData = (data): UpdateExternalRequesterAPIResponse => {
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
        .get(
          `/v3/printer_flow/external/external_requesters/${req.query.externalRequesterId}`,
          config
        )
        .then((response) => {
          res.status(response.status).json(transformShowData(response.data));
        })
        .catch((error) => {
          if (error.response?.data?.message) {
            res.status(error.response.status).json(error.response.data);
          } else {
            res.status(error.response?.status || 500).json({
              message:
                'Um erro inesperado ocorreu. Tente novamente mais tarde.',
            });
          }
        });
    case 'PUT':
      return client
        .put(
          `/v3/printer_flow/external/external_requesters/${req.query.externalRequesterId}`,
          {
            external_requester: {
              name: req.body.externalRequester.name,
              email: req.body.externalRequester.email,
              phone: req.body.externalRequester.phone.replace(/[^0-9]/g, ''),
              optional_phone: req.body.externalRequester.optionalPhone.replace(
                /[^0-9]/g,
                ''
              ),
              optional_email: req.body.externalRequester.optionalEmail,
              occupation: req.body.externalRequester.occupation,
              notification: req.body.externalRequester.notification,
            },
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
          res.status(response.status).json(transformUpdateData(response.data));
        })
        .catch((error) => {
          if (error.response?.data?.message) {
            res.status(error.response.status).json(error.response.data);
          } else {
            res.status(error.response?.status || 500).json({
              message:
                'Um erro inesperado ocorreu. Tente novamente mais tarde.',
            });
          }
        });
  }
}
