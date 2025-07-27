import client from '../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../utils';
import {
  CreateUserAPIResponse,
  IndexUsersAPIResponse,
} from '../../../../services/types';

const transformIndexData = (data): IndexUsersAPIResponse => {
  return {
    users: data['printer_cloud/users'].map((userData) => {
      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        cpf: userData.cpf,
        dateOfBirth: userData.date_of_birth,
        avatarUrl: userData.avatar_url,
        phone: userData.phone,
        prn: userData.prn,
        status: userData.status,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
        username: userData.username,
        deletedAt: userData.deleted_at,
        organizationsCount: userData.organizations_count,
        userGroupsCount: userData.user_groups_count,
      };
    }),
    meta: {
      total: data.meta.total,
    },
  };
};

const transformCreateData = (data): CreateUserAPIResponse => {
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

  const queryString = new URLSearchParams(
    camelToSnake(req.query) as Record<string, string>
  ).toString();

  switch (req.method) {
    case 'GET':
      return client
        .get(`/v3/printer_cloud/users?${queryString}`, config)
        .then((response) => {
          res.status(response.status).json(transformIndexData(response.data));
        })
        .catch((error) => {
          res.status(error.response.status).json(error.response.data);
        });
    case 'POST':
      return client
        .post(
          `/v3/printer_cloud/users`,
          {
            user: {
              cpf: req.body.cpf,
              date_of_birth: req.body.dateOfBirth,
              name: req.body.name,
              email: req.body.email,
              phone: req.body.phone,
              registration_number: req.body.registrationNumber,
              username: req.body.username,
            },
          },
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
