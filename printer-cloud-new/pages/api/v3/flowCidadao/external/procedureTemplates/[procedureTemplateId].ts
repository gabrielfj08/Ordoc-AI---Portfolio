import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../client';
import { ShowExternalProcedureTemplateAPIResponse } from '../../../../../../services/flow-cidadao/types';

const transformShowData = (data): ShowExternalProcedureTemplateAPIResponse => {
  return {
    id: data.id,
    name: data.name,
    groupRequester: data.group_requester
      ? {
          id: data.group_requester.id,
          name: data.group_requester.name,
          parentGroupId: data.group_requester.parent_group_id,
          prn: data.group_requester.prn,
          code: data.group_requester.code,
          status: data.group_requester.status,
          createdAt: data.group_requester.created_at,
          updatedAt: data.group_requesterupdated_at,
        }
      : null,
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
    .get(
      `/v3/printer_flow/external/procedure_templates/${req.query.procedureTemplateId}`,
      config
    )
    .then((response) => {
      res.status(response.status).json(transformShowData(response.data));
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
