import client from '../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../utils';
import { BaseProcedureTemplate } from '../../../../services/printer-flow/types';
import { IndexProcedureTemplateAPIResponse } from '../../../../services/printer-flow/types/procedureTemplate';

const transformCreateData = (data): BaseProcedureTemplate => {
  return {
    id: data.id,
    name: data.name,
    prn: data.prn,
    source: data.source,
    status: data.status,
    organizationId: data.organization_id,
    parentProcedureTemplateId: data.parent_procedure_template_id,
    groupRequesterId: data.group_requester_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

const transformIndexData = (data): IndexProcedureTemplateAPIResponse => {
  return {
    procedureTemplates: data['printer_flow/procedure_templates'].map(
      (procedureTemplateData) => {
        return {
          id: procedureTemplateData.id,
          name: procedureTemplateData.name,
          prn: procedureTemplateData.prn,
          source: procedureTemplateData.source,
          status: procedureTemplateData.status,
          organizationId: procedureTemplateData.organization_id,
          parentProcedureTemplateId:
            procedureTemplateData.parent_procedure_template_id,
          groupRequesterId: procedureTemplateData.group_requester_id,
          createdAt: procedureTemplateData.created_at,
          updatedAt: procedureTemplateData.updated_at,
          childrenCount: procedureTemplateData.children_count,
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

  let queryString = new URLSearchParams(
    camelToSnake(req.query) as Record<string, string>
  ).toString();

  queryString = queryString.replace('status=active', 'status[]=active');
  queryString = queryString.replace('status=inactive', 'status[]=inactive');
  queryString = queryString.replace(
    'source=internal',
    'source[]=internal&source[]=internal_external'
  );
  queryString = queryString.replace(
    'source=external',
    'source[]=external&source[]=internal_external'
  );

  switch (req.method) {
    case 'GET':
      return client
        .get(`/v3/printer_flow/procedure_templates?${queryString}`, config)
        .then((response) => {
          res.status(response.status).json(transformIndexData(response.data));
        })
        .catch((error) => {
          res.status(error.response.status).json(error.response.data);
        });
    case 'POST':
      return client
        .post(
          `/v3/printer_flow/procedure_templates`,
          camelToSnake(req.body),
          config
        )
        .then((response) => {
          res.status(response.status).json(transformCreateData(response.data));
        })
        .catch((error) => {
          if (error.response?.data?.message) {
            res.status(error.response.status).json(error.response.data);
          } else {
            res.status(error.response?.status || 500).json({
              message:
                'Um erro inesperado ocorreu. Tente novamente mais tarde.',
            });
          }
        });
  }
}
