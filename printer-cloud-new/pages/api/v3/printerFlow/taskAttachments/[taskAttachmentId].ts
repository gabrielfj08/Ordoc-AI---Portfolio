import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../client';
import {
  ShowTaskAttachmentAPIResponse,
  DeleteTaskAttachmentAPIResponse,
} from '../../../../../services/printer-flow/types';

const transformShowData = (data): ShowTaskAttachmentAPIResponse => {
  return {
    id: data.id,
    attachableId: data.attachable_id,
    attachableType: data.attachable_type,
    taskId: data.task_id,
    createdById: data.created_by_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    task: {
      id: data.task.id,
      deadline: data.task.deadline,
      priority: data.task.priority,
      prn: data.task.prn,
      groupAssigneeId: data.task.group_assignee_id,
      procedureId: data.task.procedure_id,
      name: data.task.id,
      description: data.task.description,
      assigneeId: data.task.assignee_id,
      taskTemplateId: data.task.task_template_id,
      createdById: data.task.created_by_id,
      status: data.task.status,
      createdAt: data.task.created_at,
      updatedAt: data.task.updated_at,
    },
    attachable: {
      id: data.attachable.id,
      status: data.attachable.status,
      procedureId: data.attachable.procedure_id,
      s3Key: data.attachable.s3_key,
      name: data.attachable.name,
      signedDocumentId: data.attachable.signed_document_id,
      documentId: data.attachable.document_id,
      uuid: data.attachable.uuid,
      createdById: data.attachable.created_by_id,
      createdAt: data.attachable.created_at,
      updatedAt: data.attachable.updated_at,
      documentUrl: data.attachable.document_url,
    },
    createdBy: {
      id: data.created_by.id,
      name: data.created_by.name,
      organizationId: data.created_by.organization_id,
      parentGroupId: data.created_by.parent_group_id,
      cpfCnpj: data.created_by.cpf_cnpj,
      prn: data.created_by.prn,
      code: data.created_by.code,
      email: data.created_by.email,
      optionalEmail: data.created_by.optional_email,
      type: data.created_by.type,
      status: data.created_by.status,
      blocked: data.created_by.blocked,
      phone: data.created_by.phone,
      optionalPhone: data.created_by.optional_phone,
      occupation: data.created_by.occupation,
      birthDate: data.created_by.birth_date,
      createdAt: data.created_by.created_at,
      updatedAt: data.created_by.updated_at,
    },
  };
};

const transformDeleteData = (data): DeleteTaskAttachmentAPIResponse => {
  return {
    id: data.id,
    attachableId: data.attachable_id,
    attachableType: data.attachable_type,
    taskId: data.task_id,
    createdById: data.created_by_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    task: {
      id: data.task.id,
      deadline: data.task.deadline,
      priority: data.task.priority,
      prn: data.task.prn,
      groupAssigneeId: data.task.group_assignee_id,
      procedureId: data.task.procedure_id,
      name: data.task.id,
      description: data.task.description,
      assigneeId: data.task.assignee_id,
      taskTemplateId: data.task.task_template_id,
      createdById: data.task.created_by_id,
      status: data.task.status,
      createdAt: data.task.created_at,
      updatedAt: data.task.updated_at,
    },
    attachable: {
      id: data.attachable.id,
      status: data.attachable.status,
      procedureId: data.attachable.procedure_id,
      s3Key: data.attachable.s3_key,
      name: data.attachable.name,
      signedDocumentId: data.attachable.signed_document_id,
      documentId: data.attachable.document_id,
      uuid: data.attachable.uuid,
      createdById: data.attachable.created_by_id,
      createdAt: data.attachable.created_at,
      updatedAt: data.attachable.updated_at,
      documentUrl: data.attachable.document_url,
    },
    createdBy: {
      id: data.created_by.id,
      name: data.created_by.name,
      organizationId: data.created_by.organization_id,
      parentGroupId: data.created_by.parent_group_id,
      cpfCnpj: data.created_by.cpf_cnpj,
      prn: data.created_by.prn,
      code: data.created_by.code,
      email: data.created_by.email,
      optionalEmail: data.created_by.optional_email,
      type: data.created_by.type,
      status: data.created_by.status,
      blocked: data.created_by.blocked,
      phone: data.created_by.phone,
      optionalPhone: data.created_by.optional_phone,
      occupation: data.created_by.occupation,
      birthDate: data.created_by.birth_date,
      createdAt: data.created_by.created_at,
      updatedAt: data.created_by.updated_at,
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

  switch (req.method) {
    case 'GET':
      return client
        .get(
          `/v3/printer_flow/task_attachments/${req.query.taskAttachmentId}`,
          config
        )
        .then((response) => {
          res.status(response.status).json(transformShowData(response.data));
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

    case 'DELETE':
      return client
        .delete(
          `/v3/printer_flow/task_attachments/${req.query.taskAttachmentId}`,
          config
        )
        .then((response) => {
          res.status(response.status).json(transformDeleteData(response.data));
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
