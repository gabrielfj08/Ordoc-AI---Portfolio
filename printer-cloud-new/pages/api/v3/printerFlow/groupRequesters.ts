import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../client';
import {
  CreateGroupRequesterAPIResponse,
  IndexGroupRequestersAPIResponse,
} from '../../../../services/printer-flow/types';
import { camelToSnake } from '../../../../utils';

const transformCreateData = (data): CreateGroupRequesterAPIResponse => {
  return {
    id: data.id,
    name: data.name,
    parentGroupId: data.parent_group_id,
    prn: data.prn,
    code: data.code,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    ancestorGroupTree: data.ancestor_group_tree.length
      ? data.ancestor_group_tree.map((ancestor) => {
          return {
            id: ancestor.id,
            name: ancestor.name,
            code: ancestor.code,
          };
        })
      : [],
    usersCount: data.users_count,
    parentGroup: data.parent_group
      ? {
          id: data.parent_group.id,
          name: data.parent_group.name,
          organizationId: data.parent_group.organization_id,
          parentGroupId: data.parent_group.parent_group_id,
          cpfCnpj: data.parent_group.cpf_cnpj || null,
          prn: data.parent_group.prn,
          code: data.parent_group.code,
          email: data.parent_group.email || null,
          optionalEmail: data.parent_group.optional_email || null,
          type: data.parent_group.type,
          status: data.parent_group.status,
          phone: data.parent_group.phone || null,
          optionalPhone: data.parent_group.optional_phone || null,
          occupation: data.parent_group.occupation || null,
          birthDate: data.parent_group.birth_date || null,
          createdAt: data.parent_group.created_at,
          updatedAt: data.parent_group.updated_at,
        }
      : null,
  };
};

const transformIndexData = (data): IndexGroupRequestersAPIResponse => {
  return {
    groupRequesters: data['printer_flow/group_requesters'].map(
      (groupRequesterData) => {
        return {
          id: groupRequesterData.id,
          name: groupRequesterData.name,
          parentGroupId: groupRequesterData.parent_group_id,
          prn: groupRequesterData.prn,
          code: groupRequesterData.code,
          status: groupRequesterData.status,
          createdAt: groupRequesterData.created_at,
          updatedAt: groupRequesterData.updated_at,
          usersCount: groupRequesterData.users_count,
        };
      }
    ),
    meta: {
      total: data.meta.total,
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
    camelToSnake(req.query) as Record<string, string>
  ).toString();

  switch (req.method) {
    case 'GET':
      return client
        .get(`/v3/printer_flow/group_requesters?${queryString}`, config)
        .then((response) => {
          res.status(response.status).json(transformIndexData(response.data));
        })
        .catch((error) => {
          res.status(error.response.status).json(error.response.data);
        });
    case 'POST':
      return client
        .post(
          `/v3/printer_flow/group_requesters`,
          camelToSnake(req.body),
          config
        )
        .then((response) => {
          res.status(response.status).json(transformCreateData(response.data));
        })
        .catch((error) => {
          res.status(error.response.status).json(error.response.data);
        });
  }
}
