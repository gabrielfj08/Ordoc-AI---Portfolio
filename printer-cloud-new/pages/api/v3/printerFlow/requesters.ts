import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../client';
import { camelToSnake } from '../../../../utils';
import { IndexRequestersAPIResponse } from '../../../../services/printer-flow/types/requester';

const transformData = (data): IndexRequestersAPIResponse => {
  return {
    requesters: data['printer_flow/requesters'].map((requesterData) => {
      return {
        id: requesterData.id,
        name: requesterData.name,
        organizationId: requesterData.organization_id,
        parentGroupId: requesterData.parent_group_id,
        cpfCnpj: requesterData.cpf_cnpj,
        prn: requesterData.prn,
        code: requesterData.code,
        email: requesterData.email,
        optionalEmail: requesterData.optional_email,
        type: requesterData.type,
        status: requesterData.status,
        phone: requesterData.phone,
        optionalPhone: requesterData.optional_phone,
        occupation: requesterData.occupation,
        birthDate: requesterData.birth_date,
        createdAt: requesterData.created_at,
        updatedAt: requesterData.updated_at,
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

  queryString = queryString.replace(
    'type=InternalRequester',
    'type[]=internal_requester'
  );
  queryString = queryString.replace(
    'type=ExternalRequester',
    'type[]=external_requester'
  );
  queryString = queryString.replace(
    'type=GroupRequester',
    'type[]=group_requester'
  );
  queryString = queryString.replace(
    'type=',
    'type[]=internal_requester&type[]=external_requester'
  );

  return client
    .get(`/v3/printer_flow/requesters?${queryString}`, config)
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
