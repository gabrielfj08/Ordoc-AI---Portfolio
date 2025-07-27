import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../client';
import {
  ShowGroupRequesterAPIResponse,
  UpdateGroupRequesterAPIResponse,
} from '../../../../../services/printer-flow/types';

const transformShowData = (data): ShowGroupRequesterAPIResponse => {
  return {
    id: data.id,
    name: data.name,
    parentGroupId: data.parent_group_id,
    prn: data.prn,
    code: data.code,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    ancestorGroupTree: data.ancestor_group_tree
      ? data.ancestor_group_tree.map((ancestorGroup) => ({
          id: ancestorGroup.id,
          name: ancestorGroup.name,
          code: ancestorGroup.code,
        }))
      : [],
    usersCount: data.users_count,
    parentGroup: data.parent_group,
  };
};

const transformUpdateData = (data): UpdateGroupRequesterAPIResponse => {
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

  switch (req.method) {
    case 'GET':
      return client
        .get(`/v3/printer_flow/group_requesters/${req.query.id}`, config)
        .then((response) => {
          res.status(response.status).json(transformShowData(response.data));
        })
        .catch((error) => {
          res.status(error.response.status).json(error.response.data);
        });
    case 'PUT':
      return client
        .put(
          `/v3/printer_flow/group_requesters/${req.query.id}`,
          {
            name: req.body.name,
          },
          config
        )
        .then((response) => {
          res.status(response.status).json(transformUpdateData(response.data));
        })
        .catch((error) => {
          res.status(error.response.status).json(error.response.data);
        });
  }
}
