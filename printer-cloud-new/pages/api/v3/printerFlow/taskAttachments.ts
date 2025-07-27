import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../client';
import { camelToSnake } from '../../../../utils';
import {
  CreateTaskAttachmentAPIResponse,
  IndexTaskAttachmentsAPIResponse,
} from '../../../../services/printer-flow/types';

const transformIndexData = (data): IndexTaskAttachmentsAPIResponse => {
  return {
    taskAttachments: data['printer_flow/task_attachments'].map(
      (taskAttachmentData) => {
        return {
          id: taskAttachmentData.id,
          attachableId: taskAttachmentData.attachable_id,
          attachableType: taskAttachmentData.attachable_type,
          taskId: taskAttachmentData.task_id,
          createdById: taskAttachmentData.created_by_id,
          createdAt: taskAttachmentData.created_at,
          updatedAt: taskAttachmentData.updated_at,
          attachable: {
            id: taskAttachmentData.attachable.id,
            status: taskAttachmentData.attachable.status,
            procedureId: taskAttachmentData.attachable.procedure_id,
            s3Key: taskAttachmentData.attachable.s3_key,
            name: taskAttachmentData.attachable.name,
            signedDocumentId: taskAttachmentData.attachable.signed_document_id,
            documentId: taskAttachmentData.attachable.document_id,
            uuid: taskAttachmentData.attachable.uuid,
            createdById: taskAttachmentData.attachable.created_by_id,
            createdAt: taskAttachmentData.attachable.created_at,
            updatedAt: taskAttachmentData.attachable.updated_at,
            documentUrl: taskAttachmentData.attachable.document_url,
          },
        };
      }
    ),
    meta: {
      total: data.meta.total,
    },
  };
};

const transformCreateData = (data): CreateTaskAttachmentAPIResponse => {
  return {
    id: data.id,
    ids: data.ids,
    payload: {
      procedureDocumentIds: data.payload.procedure_document_ids,
      taskDocumentIds: data.payload.task_document_ids,
    },
    action: data.action,
    recordType: data.record_type,
    createdById: data.created_by_id,
    status: data.status,
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

  switch (req.method) {
    case 'GET':
      return client
        .get(`/v3/printer_flow/task_attachments?${queryString}`, config)
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
          `/v3/printer_flow/task_attachments`,
          {
            task_id: req.body.taskId,
            procedure_document_ids: req.body.procedureDocumentIds,
            task_document_ids: req.body.taskDocumentIds,
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
