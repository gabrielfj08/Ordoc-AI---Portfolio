import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../../../client';
import { ShowProcedureAPIResponse } from '../../../../../../../../services/printer-flow/types';

const transformData = (data): ShowProcedureAPIResponse => {
  return {
    id: data.id,
    deadline: data.deadline,
    priority: data.priority,
    private: data.private,
    prn: data.prn,
    organizationId: data.organization_id,
    processNumber: data.process_number,
    responsibleGroupId: data.responsible_group_id,
    requesterId: data.requester_id,
    createdById: data.created_by_id,
    procedureTemplateName: data.procedure_template_name,
    procedureTemplateId: data.procedure_template_id,
    source: data.source,
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
      organizationId: data.requester.organization_id,
      parentGroupId: data.requester.parent_group_id,
      cpfCnpj: data.requester.cpf_cnpj,
      prn: data.requester.prn,
      code: data.requester.code,
      email: data.requester.email,
      optionalEmail: data.requester.optional_email,
      type: data.requester.type,
      status: data.requester.status,
      blocked: data.requester.blocked,
      phone: data.requester.phone,
      optionalPhone: data.requester.optional_phone,
      occupation: data.requester.occupation,
      birthDate: data.requester.birth_date,
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
    createdBy: {
      id: data.created_by.id,
      name: data.created_by.name,
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
      `/v3/printer_flow/group_requesters/${req.query.id}/procedures/${req.query.procedureId}/finish`,
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
