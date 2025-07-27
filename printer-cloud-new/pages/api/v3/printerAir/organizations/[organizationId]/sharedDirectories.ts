import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../client';
import { IndexSharedDirectoriesAPIResponse } from '../../../../../../services/printer-air/types';
import { camelToSnake } from '../../../../../../utils';

const transformIndexData = (data): IndexSharedDirectoriesAPIResponse => {
  return {
    sharedDirectories: data['printer_air/shared_objects'].map(
      (sharedDirectoryData) => {
        return {
          id: sharedDirectoryData.id,
          parentSharedId: sharedDirectoryData.parent_shared_id,
          objectPrn: sharedDirectoryData.object_prn,
          organizationId: sharedDirectoryData.organization_id,
          prn: sharedDirectoryData.prn,
          userId: sharedDirectoryData.user_id,
          createdAt: sharedDirectoryData.created_at,
          updateAt: sharedDirectoryData.updated_at,
          directory: {
            id: sharedDirectoryData.directory.id,
            name: sharedDirectoryData.directory.name,
            description: sharedDirectoryData.directory.name,
          },
          createdBy: {
            id: sharedDirectoryData.created_by.id,
            name: sharedDirectoryData.created_by.name,
          },
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

  return client
    .get(
      `/v3/printer_air/organizations/${req.query.organizationId}/shared_directories?${queryString}`,
      config
    )
    .then((response) => {
      res.status(response.status).json(transformIndexData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
