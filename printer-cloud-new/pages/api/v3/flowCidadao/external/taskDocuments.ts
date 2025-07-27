import client from '../../../../../client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { IndexExternalTaskDocumentsAPIResponse } from '../../../../../services/flow-cidadao/types';
import { camelToSnake } from '../../../../../utils';

const transformIndexData = (data): IndexExternalTaskDocumentsAPIResponse => {
  return {
    taskDocuments: data['printer_flow/task_documents'].map(
      (taskDocumentData) => {
        return {
          id: taskDocumentData.id,
          status: taskDocumentData.status,
          taskId: taskDocumentData.task_id,
          s3Key: taskDocumentData.s3_key,
          name: taskDocumentData.name,
          signedDocumentId: taskDocumentData.signed_document_id,
          documentId: taskDocumentData.document_id,
          createdById: taskDocumentData.created_by_id,
          createdAt: taskDocumentData.created_at,
          updatedAt: taskDocumentData.updated_at,
          createdBy: {
            id: taskDocumentData.created_by.id,
            name: taskDocumentData.created_by.name,
            email: taskDocumentData.created_by.email,
            cpf: taskDocumentData.created_by.cpf,
            dateOfBirth: taskDocumentData.created_by.date_of_birth,
            avatarUrl: taskDocumentData.created_by.avatar_url,
            organizationId: taskDocumentData.created_by.organization_id,
            phone: taskDocumentData.created_by.phone,
            prn: taskDocumentData.created_by.prn,
            status: taskDocumentData.created_by.status,
            username: taskDocumentData.created_by.username,
            changedPassword: taskDocumentData.created_by.changed_password,
            registrationNumber: taskDocumentData.created_by.registration_number,
            createdAt: taskDocumentData.created_by.created_at,
            updatedAt: taskDocumentData.created_by.updated_at,
            deletedAt: taskDocumentData.created_by.deleted_at,
          },
        };
      }
    ),
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

  queryString = queryString.replace('status=created', 'status[]=created');
  queryString = queryString.replace('status=running', 'status[]=running');
  queryString = queryString.replace('status=finished', 'status[]=finished');
  queryString = queryString.replace('status=failed', 'status[]=failed');

  return client
    .get(`/v3/printer_flow/external/task_documents?${queryString}`, config)
    .then((response) => {
      res.status(response.status).json(transformIndexData(response.data));
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
