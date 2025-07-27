import client from '../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { camelToSnake } from '../../../../../../utils';
import { SetAssigneeTaskAPIResponse } from '../../../../../../services/printer-flow/types';

const transformData = (data): SetAssigneeTaskAPIResponse => {
  return {
    id: data.id,
    deadline: data.deadline,
    priority: data.priority,
    prn: data.prn,
    groupAssigneeId: data.group_assignee_id,
    procedureId: data.procedure_id,
    name: data.name,
    description: data.description,
    assigneeId: data.assignee_id,
    createdById: data.created_by_id,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    assignee: data.assignee
      ? {
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
          phone: data.assignee.phone,
          optionalPhone: data.assignee.optional_phone,
          occupation: data.assignee.occupation,
          birthDate: data.assignee.birth_date,
          createdAt: data.assignee.created_at,
          updatedAt: data.assignee.updated_at,
        }
      : null,
    groupAssignee: data.group_assignee
      ? {
          id: data.group_assignee.id,
          name: data.group_assignee.name,
          parentGroupId: data.group_assignee.parent_group_id,
          prn: data.group_assignee.prn,
          code: data.group_assignee.code,
          status: data.group_assignee.status,
          createdAt: data.group_assignee.created_at,
          updatedAt: data.group_assignee.updated_at,
        }
      : null,
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

  const queryString = new URLSearchParams(
    req.query as Record<string, string>
  ).toString();

  return client
    .put(
      `/v3/printer_flow/tasks/${req.query.taskId}/set_assignee`,
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
