import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../client';
import { RemoveRequesterFromGroupAPIResponse } from '../../../../../../services/printer-flow/types';

const transformData = (data): RemoveRequesterFromGroupAPIResponse => {
  return {
    id: data.id,
    name: data.name,
    parentGroupId: data.parent_group_id,
    prn: data.prn,
    code: data.code,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    ancestorGroupTree: data.ancestor_group_tree
      ? data.ancestor_group_tree.map((ancestorGroup) => ({
          id: ancestorGroup.id,
          name: ancestorGroup.name,
          code: ancestorGroup.code,
        }))
      : [],
    usersCount: data.users_count,
    parentGroup: data.parent_group,
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
      `/v3/printer_flow/group_requesters/${req.query.id}/remove_requester`,
      {
        requester_id: req.body.requesterId,
      },
      config
    )
    .then((response) => {
      res.status(response.status).json(transformData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
