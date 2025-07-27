import client from '../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { PutAddUserGroupPropsAPIResponse } from '../../../../../../services/types/user';

const transformData = (data): PutAddUserGroupPropsAPIResponse => {
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
    changedPassword: data.changed_password,
    registrationNumber: data.registration_number,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    deletedAt: data.deleted_at,
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
      `/v3/printer_cloud/users/${req.query.id}/add_user_groups`,
      { user_group_ids: req.body.userGroupIds },
      config
    )
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
