import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../client';
import { CreateGroupRequesterInfoAPIResponse } from '../../../../../../services/printer-flow/types';

const transformData = (data): CreateGroupRequesterInfoAPIResponse => {
  return {
    id: data.id,
    status: data.status,
    proceduresCount: data.procedures_count,
    groupRequesterId: data.group_requester_id,
    createdById: data.created_by_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    childrenProcedureTemplates: data.children_procedure_templates
      ? data.children_procedure_templates.map((childrenProcedureTemplate) => {
          return {
            id: childrenProcedureTemplate.id,
            name: childrenProcedureTemplate.name,
            prn: childrenProcedureTemplate.prn,
            source: childrenProcedureTemplate.source,
            status: childrenProcedureTemplate.status,
            organizationId: childrenProcedureTemplate.organization_id,
            parentProcedureTemplateId:
              childrenProcedureTemplate.parent_procedure_template_id,
            groupRequesterId: childrenProcedureTemplate.group_requester_id,
            createdAt: childrenProcedureTemplate.created_at,
            updatedAt: childrenProcedureTemplate.updated_at,
          };
        })
      : [],
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
    .post(
      `/v3/printer_flow/group_requesters/${req.query.id}/group_requester_infos`,
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
