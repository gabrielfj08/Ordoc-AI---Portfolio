import client from '../../../../../../client';
import { DestroySharedProcedureAPIResponse } from '../../../../../../services/flow-cidadao/types';
import { NextApiRequest, NextApiResponse } from 'next';

const tranformDestroyData = (data): DestroySharedProcedureAPIResponse => {
  return {
    id: data.id,
    status: data.status,
    externalRequesterId: data.external_requester_id,
    procedureId: data.procedure_id,
    createdById: data.created_by_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
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
    .delete(
      `/v3/printer_flow/external/shared_procedures/${req.query.sharedProcedureId}`,
      config
    )
    .then((response) => {
      res.status(response.status).json(tranformDestroyData(response.data));
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
