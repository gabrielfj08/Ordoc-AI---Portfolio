import client from '../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { PutAttachPolicyToUserGroupsAPIResponse } from '../../../../../../services/types';

const transformData = (data): PutAttachPolicyToUserGroupsAPIResponse => {
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
    actions: data.actions.map((actionData) => {
      return {
        id: actionData.id,
        accessLevel: actionData.access_level,
        service: actionData.service,
        resource: actionData.resource,
        action: actionData.action,
        label: actionData.label,
        createdAt: actionData.created_at,
        updatedAt: actionData.updated_at,
        translatedResource: actionData.translated_resource,
      };
    }),
    organization: {
      corporateName: data.organization.corporate_name,
      cnpj: data.organization.cnpj,
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

  return client
    .put(
      `/v3/printer_cloud/policies/${req.query.policyId}/attach_policy_to_user_groups`,
      { user_group_ids: req.body.userGroupIds }, // TODO: CREATE toSnakeCase HELPER
      config
    )
    .then((response) => {
      res.status(response.status).json(transformData(response.data));
    })
    .catch((error) => {
      if (error.response?.data?.message) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(error.response?.status || 500).json({
          message: 'Um erro inesperado ocorreu. Tente novamente mais tarde.',
        });
      }
    });
}
