import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../client';
import { IndexRequestersFromGroupAPIResponse } from '../../../../../../services/printer-flow/types';
import { camelToSnake } from '../../../../../../utils';

const transformData = (data): IndexRequestersFromGroupAPIResponse => {
  return {
    requestersFromGroup: data['printer_flow/internal_requesters'].map(
      (requesterFromGroupData) => {
        return {
          id: requesterFromGroupData.id,
          name: requesterFromGroupData.name,
          organizationId: requesterFromGroupData.organization_id,
          parentGroupId: requesterFromGroupData.parent_group_id,
          cpfCnpj: requesterFromGroupData.cpf_cnpj,
          prn: requesterFromGroupData.prn,
          code: requesterFromGroupData.code,
          email: requesterFromGroupData.email,
          optionalEmail: requesterFromGroupData.optional_email
            ? requesterFromGroupData.optional_email
            : null,
          type: requesterFromGroupData.type,
          status: requesterFromGroupData.status,
          phone: requesterFromGroupData.phone,
          optionalPhone: requesterFromGroupData.optional_phone
            ? requesterFromGroupData.optional_phone
            : null,
          occupation: requesterFromGroupData.occupation,
          birthDate: requesterFromGroupData.birth_date,
          createdAt: requesterFromGroupData.created_at,
          updatedAt: requesterFromGroupData.updated_at,
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
      `/v3/printer_flow/group_requesters/${req.query.id}/requesters?${queryString}`,
      config
    )
    .then((response) => {
      res.status(response.status).json(transformData(response.data));
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
