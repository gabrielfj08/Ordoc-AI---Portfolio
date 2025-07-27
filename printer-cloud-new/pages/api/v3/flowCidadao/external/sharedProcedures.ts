import client from '../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../../utils';
import {
  IndexSharedProceduresAPIResponse,
  CreateSharedProcedureAPIResponse,
} from '../../../../../services/flow-cidadao/types';

const transformIndexData = (data): IndexSharedProceduresAPIResponse => {
  return {
    sharedProcedures: data['printer_flow/shared_procedures'].map(
      (sharedProceduresData) => {
        return {
          id: sharedProceduresData.id,
          status: sharedProceduresData.status,
          externalRequesterId: sharedProceduresData.external_requester_id,
          procedureId: sharedProceduresData.procedure_id,
          createdById: sharedProceduresData.created_by_id,
          createdAt: sharedProceduresData.created_at,
          updatedAt: sharedProceduresData.updated_at,
          procedure: {
            id: sharedProceduresData.procedure.id,
            prn: sharedProceduresData.procedure.prn,
            organizationId: sharedProceduresData.procedure.organization_id,
            processNumber: sharedProceduresData.procedure.process_number,
            responsibleGroupId:
              sharedProceduresData.procedure.responsible_group_id,
            requesterId: sharedProceduresData.procedure.requester_id,
            createdById: sharedProceduresData.procedure.created_by_id,
            procedureTemplateName:
              sharedProceduresData.procedure.procedure_template_name,
            procedureTemplateId:
              sharedProceduresData.procedure.procedure_template_id,
            status: sharedProceduresData.procedure.status,
            schema: sharedProceduresData.schema
              ? data.schema.map((schemaItem) => {
                  return {
                    label: schemaItem.label,
                    fieldType: schemaItem.field_type,
                    options: schemaItem.options,
                  };
                })
              : null,
            payload: sharedProceduresData.payload
              ? data.payload.map((payloadItem) => {
                  return {
                    label: payloadItem.label,
                    fieldType: payloadItem.field_type,
                    value: payloadItem.value,
                    options: payloadItem.options,
                  };
                })
              : null,
            createdAt: sharedProceduresData.procedure.created_at,
            updatedAt: sharedProceduresData.procedure.updated_at,
          },
          externalRequester: {
            id: sharedProceduresData.external_requester.id,
            name: sharedProceduresData.external_requester.name,
            email: sharedProceduresData.external_requester.email,
            cpfCnpj: sharedProceduresData.external_requester.cpf_cnpj,
            birthDate: sharedProceduresData.external_requester.birth_date,
            phone: sharedProceduresData.external_requester.phone,
            optionaEmail:
              sharedProceduresData.external_requester.optional_email,
            optionalPhone:
              sharedProceduresData.external_requester.optional_phone,
            occupation: sharedProceduresData.external_requester.occupation,
            notification: sharedProceduresData.external_requester.notification,
            status: sharedProceduresData.external_requester.status,
            blocked: sharedProceduresData.external_requester.blocked,
            prn: sharedProceduresData.external_requester.prn,
            organizationId:
              sharedProceduresData.external_requester.organization_id,
            changedPassword:
              sharedProceduresData.external_requester.changed_password,
            createdAt: sharedProceduresData.external_requester.created_at,
            updatedAt: sharedProceduresData.external_requester.updated_at,
          },
          createdBy: {
            id: sharedProceduresData.created_by.id,
            name: sharedProceduresData.created_by.name,
            email: sharedProceduresData.created_by.email,
            cpfCnpj: sharedProceduresData.created_by.cpf_cnpj,
            birthDate: sharedProceduresData.created_by.birth_date,
            phone: sharedProceduresData.created_by.phone,
            optionalEmail: sharedProceduresData.created_by.optional_email,
            optionalPhone: sharedProceduresData.created_by.optional_phone,
            occupation: sharedProceduresData.created_by.occupation,
            notification: sharedProceduresData.created_by.notification,
            status: sharedProceduresData.created_by.status,
            blocked: sharedProceduresData.created_by.blocked,
            prn: sharedProceduresData.created_by.prn,
            organizationId: sharedProceduresData.created_by.organization_id,
            changedPassword: sharedProceduresData.created_by.changed_password,
            createdAt: sharedProceduresData.created_by.created_at,
            updatedAt: sharedProceduresData.created_by.updated_at,
          },
        };
      }
    ),
    meta: {
      total: data.meta.total,
    },
  };
};

const transformCreateData = (data): CreateSharedProcedureAPIResponse => {
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
  let queryString = new URLSearchParams(
    camelToSnake(req.query) as Record<string, string>
  ).toString();

  queryString = queryString.replace('status=created', 'status[]=created');
  queryString = queryString.replace('status=accepted', 'status[]=accepted');
  queryString = queryString.replace('status=refused', 'status[]=refused');
  queryString = queryString.replace(
    'status=allStatus',
    'status[]=created&status[]=accepted'
  );

  switch (req.method) {
    case 'GET':
      return client
        .get(
          `/v3/printer_flow/external/shared_procedures?${queryString}`,
          config
        )
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
          `/v3/printer_flow/external/shared_procedures`,
          {
            cpf_cnpj: req.body.cpfCnpj.replace(/[^\d]/g, ''),
            procedure_id: req.body.procedureId,
          },
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
