import { NextApiRequest, NextApiResponse } from 'next';
import {
  ShowPolicyAPIResponse,
  UpdatePolicyAPIResponse,
} from '../../../../../services/types';
import client from '../../../../../client';

const transformShowData = (data): ShowPolicyAPIResponse => {
  return {
    id: data.id,
    name: data.name,
    prn: data.prn,
    effect: data.effect,
    resource: data.resource,
    organizationId: data.organization_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    description: data.description,
    source: data.source,
    usersCount: data.users_count,
    userGroupsCount: data.user_groups_count,
    actions: data.actions.map((action) => ({
      id: action.id,
      service: action.service,
      accessLevel: action.access_level,
      resource: action.resource,
      action: action.action,
      label: action.label,
      translatedResource: action.translated_resource,
    })),
    organization: {
      corporateName: data.organization.corporate_name,
      cnpj: data.organization.cnpj,
    },
    service: data.service,
  };
};

const transformUpdateData = (data): UpdatePolicyAPIResponse => {
  return {
    actionId: data.action_ids,
    effect: data.effect,
    description: data.string,
    resource: data.resource,
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
        .get(`/v3/printer_cloud/policies/${req.query.policyId}`, config)
        .then((response) => {
          res.status(response.status).json(transformShowData(response.data));
        })
        .catch((error) => {
          if (error.response.data.message) {
            res.status(error.response.status).json(error.response.data);
          } else {
            res.status(error.response.status || 500).json({
              message:
                'Um erro inesperado ocorreu. Tente novamente mais tarde.',
            });
          }
        });

    case 'PUT':
      return client
        .put(
          `/v3/printer_cloud/policies/${req.query.policyId}`,
          {
            policy: {
              description: req.body.description,
              effect: req.body.effect,
              action_ids: req.body.actionIds,
              resource: req.body.resource,
              service: req.body.service,
            },
          },
          config
        )
        .then((response) => {
          res.status(response.status).json(transformUpdateData(response.data));
        })
        .catch((error) => {
          if (error.response.data.message) {
            res.status(error.response.status).json(error.response.data);
          } else {
            res.status(error.response.status || 500).json({
              message:
                'Um erro inesperado ocorreu. Tente novamente mais tarde.',
            });
          }
        });

    case 'DELETE':
      return client
        .delete(`/v3/printer_cloud/policies/${req.query.policyId}`, config)
        .then((response) => {
          res.status(response.status).json(response.data);
        })
        .catch((error) => {
          if (error.response.data.message) {
            res.status(error.response.status).json(error.response.data);
          } else {
            res.status(error.response.status || 500).json({
              message:
                'Um erro inesperado ocorreu. Tente novamente mais tarde.',
            });
          }
        });

    default:
      throw Error;
  }
}
