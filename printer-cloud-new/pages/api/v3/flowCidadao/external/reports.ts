import client from '../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { CreateExternalReportAPIResponse } from '../../../../../services/flow-cidadao/types';

const transformData = (data): CreateExternalReportAPIResponse => {
  return {
    id: data.id,
    externalRequesterId: data.external_requester_id,
    status: data.status,
    proceduresRunningCount: data.procedures_running_count,
    proceduresStartedCount: data.procedures_started_count,
    tasksRunningCount: data.tasks_running_count,
    signaturesPendingCount: data.signatures_pending_count,
    sharedProceduresPendingCount: data.shared_procedures_pending_count,
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
    .post('/v3/printer_flow/external/reports', {}, config)
    .then((response) =>
      res.status(response.status).json(transformData(response.data))
    )
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
