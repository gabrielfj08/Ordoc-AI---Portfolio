import client from '../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { IndexUserGroupsAPIResponse } from '../../../../services/types';
import { camelToSnake } from '../../../../utils';

const transformData = (data): IndexUserGroupsAPIResponse => {
  return {
    userGroups: data['printer_cloud/user_groups'].map((userGroupData) => {
      return {
        id: userGroupData.id,
        name: userGroupData.name,
        description: userGroupData.description,
        organizationId: userGroupData.organization_id,
        status: userGroupData.status,
        prn: userGroupData.prn,
        createdAt: userGroupData.created_at,
        updatedAt: userGroupData.updated_at,
        organization: userGroupData.organization,
      };
    }),
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

  let queryString = new URLSearchParams(
    camelToSnake(req.query) as Record<string, string>
  ).toString();

  queryString = queryString.replace('status=inactive', 'status[]=inactive');
  queryString = queryString.replace('status=active', 'status[]=active');

  return client
    .get(`/v3/printer_cloud/user_groups?${queryString}`, config)
    .then((response) => {
      res.status(response.status).json(transformData(response.data));
    })
    .catch((error) => {
      if (error.response.data.message) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(error.response.status || 500).json({
          message: 'Um erro inesperado ocorreu. Tente novamente mais tarde.',
        });
      }
    });
}
