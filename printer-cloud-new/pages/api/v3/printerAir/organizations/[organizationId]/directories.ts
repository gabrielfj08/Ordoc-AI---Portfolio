import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../client';
import {
  IndexDirectoriesAPIResponse,
  CreateDirectoryAPIResponse,
} from '../../../../../../services/printer-air/types';
import { camelToSnake } from '../../../../../../utils';

const transformIndexData = (data): IndexDirectoriesAPIResponse => {
  return {
    directories: data['printer_air/directories'].map((directoryData) => {
      return {
        id: directoryData.id,
        name: directoryData.name,
        description: directoryData.description,
        organizationId: directoryData.organization_id,
        prn: directoryData.prn,
        previousParentPrn: directoryData.previous_parent_prn,
        createdAt: directoryData.created_at,
        updatedAt: directoryData.updated_at,
        createdById: directoryData.created_by_id,
        path: directoryData.path,
        shared: directoryData.shared,
        updatedBy: {
          id: directoryData.updated_by.id,
          name: directoryData.updated_by.name,
        },
        parentDirectory: directoryData.parent_directory
          ? {
              id: directoryData.parent_directory.id,
              name: directoryData.parent_directory.name,
            }
          : null,
      };
    }),
    meta: {
      total: data.meta.total,
    },
  };
};

const transformCreateData = (data): CreateDirectoryAPIResponse => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    createdById: data.created_by_id,
    organizationId: data.organization_id,
    path: data.path,
    prn: data.prn,
    parentDirectory: {
      id: data.parent_directory.id,
      name: data.parent_directory.name,
    },
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
        .get(
          `/v3/printer_air/organizations/${req.query.organizationId}/directories?${queryString}`,
          config
        )
        .then((response) => {
          res.status(response.status).json(transformIndexData(response.data));
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
    case 'POST':
      return client
        .post(
          `/v3/printer_air/organizations/${req.query.organizationId}/directories`,
          {
            directory: {
              name: req.body.name,
              description: req.body.description,
              parent_directory_id: req.body.parentDirectoryId,
            },
          },
          config
        )
        .then((response) => {
          res.status(response.status).json(transformCreateData(response.data));
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
