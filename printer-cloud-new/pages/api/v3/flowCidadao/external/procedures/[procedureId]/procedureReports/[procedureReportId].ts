import client from '../../../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ShowExternalProcedureReportAPIResponse } from '../../../../../../../../services/flow-cidadao/types';

const transformData = (data): ShowExternalProcedureReportAPIResponse => {
  return {
    id: data.id,
    status: data.status,
    documentId: data.document_id,
    procedureId: data.procedure_id,
    procedureStatus: data.procedure_status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    documentUrl: data.document_url,
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
      `/v3/printer_flow/external/procedures/${req.query.procedureId}/procedure_reports/${req.query.procedureReportId}`,
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
