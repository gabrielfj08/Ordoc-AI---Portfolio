import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../../client';
import {
  ShowDirectoryAPIResponse,
  UpdateDirectoryAPIResponse,
} from '../../../../../../../services/printer-air/types';

const transformShowData = (data): ShowDirectoryAPIResponse => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    createdBy: data.created_by,
    updatedBy: data.updated_by,
    organizationId: data.organization_id,
    path: data.path,
    prn: data.prn,
    parentDirectory: data.parent_directory
      ? {
          id: data.parent_directory.id,
          name: data.parent_directory.name,
        }
      : null,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

const transformUpdateData = (data): UpdateDirectoryAPIResponse => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    createdById: data.created_by_id,
    organizationId: data.organization_id,
    prn: data.prn,
    parentDirectory: {
      id: data.parent_directory.id,
      name: data.parent_directory.name,
    },
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    path: data.path,
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
          `/v3/printer_air/organizations/${req.query.organizationId}/directories/${req.query.directoryId}`,
          config
        )
        .then((response) => {
          res.status(response.status).json(transformShowData(response.data));
        })
        .catch((error) => {
          res.status(error.response.status).json(error.response.data);
        });
    case 'PUT':
      return client
        .put(
          `/v3/printer_air/organizations/${req.query.organizationId}/directories/${req.query.directoryId}`,
          {
            directory: {
              description: req.body.description,
            },
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
