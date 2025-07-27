import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../client';
import { camelToSnake } from '../../../../utils';

const transformData = (data) => {
  return data['printer_cloud/policy_actions'].map((policyAction) => {
    return {
      id: policyAction.id,
      accessLevel: policyAction.access_level,
      resource: policyAction.resource,
      action: policyAction.action,
      label: policyAction.label,
      createdAt: policyAction.created_at,
      updatedAt: policyAction.updated_at,
      translatedResource: policyAction.translated_resource,
    };
  });
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
    .get(`/v3/printer_cloud/policy_actions?${queryString}`, config)
    .then((response) => {
      res.status(response.status).json(transformData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
