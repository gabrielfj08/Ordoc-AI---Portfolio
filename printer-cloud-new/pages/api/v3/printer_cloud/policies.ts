import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../utils';
import client from '../../../../client';
import { IndexPoliciesAPIResponse } from '../../../../services/types';

const transformIndexData = (data): IndexPoliciesAPIResponse => {
  return {
    policies: data['printer_cloud/policies'].map((policyData) => {
      return {
        id: policyData.id,
        description: policyData.description,
        effect: policyData.effect,
        name: policyData.name,
        organizationId: policyData.organizationId,
        prn: policyData.prn,
        resource: policyData.resource,
        service: policyData.service,
        source: policyData.source,
        userGroupsCount: policyData.user_groups_count,
        usersCount: policyData.users_count,
        createdAt: policyData.created_at,
        updatedAt: policyData.updated_at,
      };
    }),
    meta: data.meta,
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
    .get(`/v3/printer_cloud/policies?${queryString}`, config)
    .then((response) => {
      res.status(response.status).json(transformIndexData(response.data));
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
