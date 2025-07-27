import client from '../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../utils';
import { IndexProceduresAPIResponse } from '../../../../services/printer-flow/types';

const transformData = (data): IndexProceduresAPIResponse => {
  return {
    procedures: data['printer_flow/procedures'].map((procedureData) => {
      return {
        id: procedureData.id,
        deadline: procedureData.deadline,
        priority: procedureData.priority,
        private: procedureData.private,
        prn: procedureData.prn,
        organizationId: procedureData.organization_id,
        processNumber: procedureData.process_number,
        responsibleGroupId: procedureData.responsible_group_id,
        requesterId: procedureData.requester_id,
        createdById: procedureData.created_by_id,
        procedureTemplateName: procedureData.procedure_template_name,
        procedureTemplateId: procedureData.procedure_template_id,
        source: procedureData.source,
        status: procedureData.status,
        schema: procedureData.schema
          ? procedureData.schema.map((schemaItem) => {
              return {
                label: schemaItem.label,
                fieldType: schemaItem.field_type,
                options: schemaItem.options,
              };
            })
          : null,
        payload: procedureData.payload
          ? procedureData.payload.map((payloadItem) => {
              return {
                label: payloadItem.label,
                fieldType: payloadItem.field_type,
                value: payloadItem.value,
              };
            })
          : null,
        createdAt: procedureData.created_at,
        updatedAt: procedureData.updated_at,
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

  queryString = queryString.replace('priority=normal', 'priority[]=normal');
  queryString = queryString.replace('priority=high', 'priority[]=high');
  queryString = queryString.replace('private=false', 'private[]=false');
  queryString = queryString.replace('private=true', 'private[]=true');
  queryString = queryString.replace('created_by_id=0', '');
  queryString = queryString.replace('source=internal', 'source[]=internal');
  queryString = queryString.replace('source=external', 'source[]=external');
  queryString = queryString.replace('status=draft', 'status[]=draft');
  queryString = queryString.replace('status=running', 'status[]=running');
  queryString = queryString.replace('status=finished', 'status[]=finished');
  queryString = queryString.replace('status=archived', 'status[]=archived');
  queryString = queryString.replace('status=started', 'status[]=started');
  queryString = queryString.replace(
    'status=progress',
    'status[]=running&status[]=started'
  );

  return client
    .get(`/v3/printer_flow/procedures?${queryString}`, config)
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
