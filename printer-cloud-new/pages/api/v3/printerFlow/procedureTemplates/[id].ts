import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../client';
import {
  ShowProcedureTemplate,
  UpdateProcedureTemplate,
} from '../../../../../services/printer-flow/types/procedureTemplate';

const transformShowData = (data): ShowProcedureTemplate => {
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
    proceduresCount: data.procedures_count,
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

const transformUpdateData = (data): UpdateProcedureTemplate => {
  return {
    id: data.id,
    name: data.name,
    prn: data.prn,
    source: data.source,
    status: data.status,
    organizationId: data.organization_id,
    parentProcedureTemplateId: data.parent_procedure_template_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    groupRequesterId: data.group_requester_id,
    groupRequester: data.group_requester
      ? {
          id: data.group_requester.id,
          name: data.group_requester.name,
          parentGroupId: data.group_requester.parent_group_id,
          prn: data.group_requester.prn,
          code: data.group_requester.code,
          status: data.group_requester.status,
          createdAt: data.group_requester.created_at,
          updatedAt: data.group_requester.updated_at,
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

  switch (req.method) {
    case 'GET':
      return client
        .get(`/v3/printer_flow/procedure_templates/${req.query.id}`, config)
        .then((response) => {
          res.status(response.status).json(transformShowData(response.data));
        })
        .catch((error) => {
          if (error.response.data.message) {
            res.status(error.response.status).json(error.response.data);
          } else {
            res.status(error.response.status || 500).json({
              message:
                'Um erro inesperado ocorreu. Tente novamente mais tarde.',
            });
          }
        });

    case 'PUT':
      return client
        .put(
          `/v3/printer_flow/procedure_templates/${req.query.id}`,
          {
            procedure_template: {
              name: req.body.name,
              group_requester_id: req.body.groupRequesterId,
              source: req.body.source,
            },
          },
          config
        )
        .then((response) => {
          res.status(response.status).json(transformUpdateData(response.data));
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
