import client from '../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { SignSignatureAPIResponse } from '../../../../../../services/printer-flow/types';
import { camelToSnake } from '../../../../../../utils';

const transformData = (data): SignSignatureAPIResponse => {
  return {
    id: data.id,
    signableId: data.signable_id,
    signableType: data.signable_type,
    requesterId: data.requester_id,
    status: data.status,
    service: data.service,
    token: data.token,
    procedureId: data.procedure_id || null,
    createdById: data.created_by_id || null,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    requester: {
      id: data.requester.id,
      name: data.requester.name,
      organizationId: data.requester.organization_id,
      parentGroupId: data.requester.parent_group_id || null,
      cpfCnpj: data.requester.cpf_cnpj,
      prn: data.requester.prn,
      code: data.requester.code || null,
      email: data.requester.email,
      optionalEmail: data.requester.optional_email || null,
      type: data.requester.type,
      status: data.requester.status,
      phone: data.requester.phone,
      optionalPhone: data.requester.optional_phone || null,
      occupation: data.requester.occupation || null,
      birthDate: data.requester.birth_date,
      createdAt: data.requester.created_at,
      updatedAt: data.requester.updated_at,
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

  queryString = queryString.replace('status=created', 'status[]=created');
  queryString = queryString.replace('status=signed', 'status[]=signed');
  queryString = queryString.replace('status=running', 'status[]=running');
  queryString = queryString.replace('status=refused', 'status[]=refused');
  queryString = queryString.replace(
    'status=inProgress',
    'status[]=signed&status[]=running'
  );

  return client
    .put(
      `/v3/printer_flow/signatures/${req.query.signatureId}/sign`,
      {},
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
