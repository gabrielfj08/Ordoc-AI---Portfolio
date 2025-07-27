import client from '../../../../../../../../client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ShowExternalTaskDocumentAPIResponse } from '../../../../../../../../services/flow-cidadao/types';
import { DeleteExternalTaskDocumentAPIResponse } from '../../../../../../../../services/flow-cidadao/types/taskDocument';

const transformDeleteData = (data): DeleteExternalTaskDocumentAPIResponse => {
  return {
    id: data.id,
    status: data.status,
    taskId: data.task_id,
    s3Key: data.s3_key,
    name: data.name,
    signedDocumentId: data.signed_document_id,
    documentId: data.document_id,
    createdById: data.created_by_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    documentUrl: data.document_url,
  };
};

const transformShowData = (data): ShowExternalTaskDocumentAPIResponse => {
  return {
    id: data.id,
    status: data.status,
    taskId: data.task_id,
    s3Key: data.s3_key,
    name: data.name,
    signedDocumentId: data.signed_document_id,
    documentId: data.document_id,
    createdById: data.created_by_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    documentUrl: data.document_url,
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

  switch (req.method) {
    case 'DELETE':
      return client
        .delete(
          `/v3/printer_flow/external/tasks/${req.query.taskId}/task_documents/${req.query.taskDocumentId}`,
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

    case 'GET':
      return client
        .get(
          `/v3/printer_flow/external/tasks/${req.query.taskId}/task_documents/${req.query.taskDocumentId}`,
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
  }
}
