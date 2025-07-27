import client from '../../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../../../../utils';
import { RunExternalProcedureAPIResponse } from '../../../../../../../services/flow-cidadao/types';

const transformData = (data): RunExternalProcedureAPIResponse => {
  return {
    id: data.id,
    prn: data.prn,
    organizationId: data.organization_id,
    processNumber: data.process_number,
    responsibleGroupId: data.responsible_group_id,
    requesterId: data.requester_id,
    createdById: data.created_by_id,
    procedureTemplateName: data.procedure_template_name,
    procedureTemplateId: data.procedure_template_id,
    status: data.status,
    schema: data.schema.map((schemaItem) => {
      return {
        label: schemaItem.label,
        fieldType: schemaItem.field_type,
        options:
          schemaItem.options && schemaItem.options.map((option) => option),
      };
    }),
    payload: data.payload.map((payloadItem) => {
      return {
        label: payloadItem.label,
        fieldType: payloadItem.field_type,
        options:
          payloadItem.options && payloadItem.options.map((option) => option),
        value: payloadItem.value,
      };
    }),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    parentProcedureTemplateName: data.parent_procedure_template_name,
    requester: {
      id: data.requester.id,
      name: data.requester.name,
      email: data.requester.email,
      cpfCnpj: data.requester.cpf_cnpj,
      birthDate: data.requester.birth_date,
      phone: data.requester.phone,
      optionalEmail: data.requester.optional_email || null,
      optionalPhone: data.requester.optional_phone || null,
      occupation: data.requester.occupation || null,
      notification: data.requester.notification,
      status: data.requester.status,
      blocked: data.requester.blocked,
      prn: data.requester.prn,
      organizationId: data.requester.organization_id,
      changedPassword: data.requester.changed_password,
      createdAt: data.requester.created_at,
      updatedAt: data.requester.updated_at,
    },
    responsibleGroup: {
      id: data.responsible_group.id,
      name: data.responsible_group.name,
      parentGroupId: data.responsible_group.parent_group_id || null,
      prn: data.responsible_group.prn,
      code: data.responsible_group.code,
      status: data.responsible_group.status,
      createdAt: data.responsible_group.created_at,
      updatedAt: data.responsible_group.updated_at,
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

  queryString = queryString.replace('created_at_lte', 'created_at[lte]');
  queryString = queryString.replace('created_at_gte', 'created_at[gte]');
  queryString = queryString.replace('status=running', 'status[]=running');
  queryString = queryString.replace('status=finished', 'status[]=finished');
  queryString = queryString.replace('status=archived', 'status[]=archived');
  queryString = queryString.replace('status=draft', 'status[]=draft');
  queryString = queryString.replace(
    'status=allStatus',
    'status[]=running&status[]=finished&status[]=archived&status[]=draft'
  );

  return client
    .put(
      `/v3/printer_flow/external/procedures/${req.query.procedureId}/run`,
      camelToSnake(req.body),
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
