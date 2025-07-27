import client from '../../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ShowProcedureReportsAPIResponse } from '../../../../../../../services/printer-flow/types';

const transformData = (data): ShowProcedureReportsAPIResponse => {
  return {
    id: data.id,
    createdById: data.created_by_id,
    documentId: data.document_id,
    procedureId: data.procedure_id,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    documentUrl: data.document_url,
    procedure: {
      id: data.procedure.id,
      deadline: data.procedure.deadline,
      priority: data.procedure.priority,
      private: data.procedure.private,
      prn: data.procedure.prn,
      organizationId: data.procedure.organization_id,
      processNumber: data.procedure.process_number,
      responsibleGroupId: data.procedure.responsible_group_id,
      requesterId: data.procedure.requester_id,
      createdById: data.procedure.created_by_id,
      procedureTemplateName: data.procedure.procedure_template_name,
      procedureTemplateId: data.procedure.procedure_template_id,
      source: data.procedure.source,
      status: data.procedure.status,
      schema: data.procedure.schema
        ? data.procedure.schema.map((schemaItem) => {
            return {
              label: schemaItem.label,
              fieldType: schemaItem.field_type,
              options: schemaItem.options,
            };
          })
        : null,
      payload: data.procedure.payload
        ? data.procedure.payload.map((payloadItem) => {
            return {
              label: payloadItem.label,
              fieldType: payloadItem.field_type,
              value: payloadItem.value,
            };
          })
        : null,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    },
    createdBy: {
      id: data.created_by.id,
      email: data.created_by.email,
      createdAt: data.created_by.created_at,
      updatedAt: data.created_by.updated_at,
      name: data.created_by.name,
      phone: data.created_by.phone,
      cpf: data.created_by.cpf,
      deletedAt: data.created_by.deleted_at,
      dateOfBirth: data.created_by.date_of_birth,
      unlockTokenSentAt: data.created_by.unlock_token_sent_at,
      status: data.created_by.status,
      prn: data.created_by.prn,
      admin: data.created_by.admin,
      avatarUrl: data.created_by.avatar_url,
      organizationId: data.created_by.organization_id,
      username: data.created_by.user_name,
      changedPassword: data.created_by.changed_password,
      registrationNumber: data.created_by.registration_number,
      oneTimePassword: data.created_by.one_time_password,
      oneTimePasswordSentAt: data.created_by.one_time_password_sent_at,
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

  return client
    .get(
      `/v3/printer_flow/procedures/${req.query.procedureId}/procedure_reports/${req.query.id}`,
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
