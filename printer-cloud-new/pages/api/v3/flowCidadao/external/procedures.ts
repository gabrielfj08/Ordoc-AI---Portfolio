import client from '../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../../utils';
import {
  CreateExternalProcedureAPIResponse,
  IndexExternalProceduresAPIResponse,
} from '../../../../../services/flow-cidadao/types';

const transformCreateData = (data): CreateExternalProcedureAPIResponse => {
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
    schema: data.schema
      ? data.schema.map((schemaItem) => {
          return {
            label: schemaItem.label,
            fieldType: schemaItem.field_type,
            options: schemaItem.options,
          };
        })
      : null,
    payload: data.payload
      ? data.payload.map((payloadItem) => {
          return {
            label: payloadItem.label,
            fieldType: payloadItem.field_type,
            value: payloadItem.value,
          };
        })
      : null,
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
      optionalPhone: data.requester.optional_phone,
      optionalEmail: data.requester.optional_email,
      occupation: data.requester.occupation,
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
      parentGroupId: data.responsible_group.parent_group_id,
      prn: data.responsible_group.prn,
      code: data.responsible_group.code,
      status: data.responsible_group.status,
      createdAt: data.responsible_group.created_at,
      updatedAt: data.responsible_group.updated_at,
    },
  };
};

const transformIndexData = (data): IndexExternalProceduresAPIResponse => {
  return {
    procedures: data['printer_flow/procedures'].map((procedureData) => {
      return {
        id: procedureData.id,
        prn: procedureData.prn,
        organizationId: procedureData.organization_id,
        processNumber: procedureData.process_number,
        responsibleGroupId: procedureData.responsible_group_id,
        requesterId: procedureData.requester_id,
        createdById: procedureData.created_by_id,
        procedureTemplateName: procedureData.procedure_template_name,
        procedureTemplateId: procedureData.procedure_template_id,
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

  const transformedQuery = req.query.createdAtLte
    ? {
        ...req.query,
        createdAtLte: String(req.query.createdAtLte).replace(
          String(req.query.createdAtLte),
          `${req.query.createdAtLte}T23:59:59`
        ),
      }
    : req.query;

  if (!req.query.createdAtGte) delete req.query.createdAtGte;
  if (!req.query.createdAtLte) delete req.query.createdAtLte;

  let queryString = new URLSearchParams(
    camelToSnake(transformedQuery) as Record<string, string>
  ).toString();

  queryString = queryString.replace('created_at_lte', 'created_at[lte]');
  queryString = queryString.replace('created_at_gte', 'created_at[gte]');
  queryString = queryString.replace('status=running', 'status[]=running');
  queryString = queryString.replace('status=finished', 'status[]=finished');
  queryString = queryString.replace('status=archived', 'status[]=archived');
  queryString = queryString.replace('status=draft', 'status[]=draft');
  queryString = queryString.replace('status=started', 'status[]=started');

  switch (req.method) {
    case 'GET':
      return client
        .get(`/v3/printer_flow/external/procedures?${queryString}`, config)
        .then((response) => {
          res.status(response.status).json(transformIndexData(response.data));
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

    case 'POST':
      return client
        .post(
          `/v3/printer_flow/external/procedures`,
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
