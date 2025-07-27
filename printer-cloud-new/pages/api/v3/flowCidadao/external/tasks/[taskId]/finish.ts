import client from '../../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { FinishExternalTaskAPIResponse } from '../../../../../../../services/flow-cidadao/types';

const transformData = (data): FinishExternalTaskAPIResponse => {
  return {
    id: data.id,
    procedureId: data.procedure_id,
    name: data.name,
    description: data.description,
    status: data.status,
    createdById: data.created_by_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    assignee: {
      id: data.assignee.id,
      name: data.assignee.name,
      organizationId: data.assignee.organization_id,
      parentGroupId: data.assignee.parent_group_id,
      cpfCnpj: data.assignee.cpf_cnpj,
      prn: data.assignee.prn,
      code: data.assignee.code,
      email: data.assignee.email,
      optionalEmail: data.assignee.optional_email,
      type: data.assignee.type,
      status: data.assignee.status,
      blocked: data.assignee.blocked,
      phone: data.assignee.phone,
      optionalPhone: data.assignee.optional_phone,
      occupation: data.assignee.occupation,
      birthDate: data.assignee.birth_date,
      createdAt: data.assignee.created_at,
      updatedAt: data.assignee.updated_at,
    },
    groupAssignee: {
      id: data.group_assignee.id,
      name: data.group_assignee.name,
      organizationId: data.group_assignee.organization_id,
      parentGroupId: data.group_assignee.parent_group_id,
      cpfCnpj: data.group_assignee.cpf_cnpj,
      prn: data.group_assignee.prn,
      code: data.group_assignee.code,
      email: data.group_assignee.email,
      optionalEmail: data.group_assignee.optional_email,
      type: data.group_assignee.type,
      status: data.group_assignee.status,
      blocked: data.group_assignee.blocked,
      phone: data.group_assignee.phone,
      optionalPhone: data.group_assignee.optional_phone,
      occupation: data.group_assignee.occupation,
      birthDate: data.group_assignee.birth_date,
      createdAt: data.group_assignee.created_at,
      updatedAt: data.group_assignee.updated_at,
    },
    createdBy: {
      id: data.created_by.id,
      name: data.created_by.id,
      email: data.created_by.email,
      cpf: data.created_by.cpf,
      dateOfBirth: data.created_by.date_of_birth,
      avatarUrl: data.created_by.avatar_url,
      organizationId: data.created_by.organization_id,
      phone: data.created_by.phone,
      prn: data.created_by.prn,
      status: data.created_by.status,
      username: data.created_by.username,
      changedPassword: data.created_by.changed_password,
      registrationNumber: data.created_by.registration_number,
      createdAt: data.created_by.created_at,
      updatedAt: data.created_by.updated_at,
      deletedAt: data.created_by.deleted_at,
    },
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
              options: payloadItem.options,
            };
          })
        : null,
      createdAt: data.procedure.created_at,
      updatedAt: data.procedure.updated_at,
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
    .put(
      `/v3/printer_flow/external/tasks/${req.query.taskId}/finish`,
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
