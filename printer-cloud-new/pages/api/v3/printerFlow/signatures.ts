import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../client';
import { camelToSnake } from '../../../../utils';
import { IndexSignaturesAPIResponse } from '../../../../services/printer-flow/types';
import { CreateSignatureAPIResponse } from '../../../../services/printer-flow/types/signature';

const transformCreateData = (data): CreateSignatureAPIResponse => {
  return {
    id: data.id,
    ids: data.ids,
    payload: {
      procedureDocumentIds: data.payload.procedure_document_ids,
      taskDocumentIds: data.payload.task_document_ids,
    },
    actions: data.actions,
    recordType: data.record_type,
    createdById: data.created_by_id,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

const transformData = (data): IndexSignaturesAPIResponse => {
  return {
    signatures: data['printer_sign/signatures'].map((signatureData) => {
      return {
        id: signatureData.id,
        signableId: signatureData.signable_id,
        signableType: signatureData.signable_type,
        requesterId: signatureData.requester_id,
        status: signatureData.status,
        service: signatureData.service,
        token: signatureData.token,
        procedureId: signatureData.procedure_id || null,
        createdById: signatureData.created_by_id || null,
        createdAt: signatureData.created_at,
        updatedAt: signatureData.updated_at,
        procedure: {
          id: signatureData.procedure.id,
          deadline: signatureData.procedure.deadline || null,
          priority: signatureData.procedure.priority,
          private: signatureData.procedure.private,
          prn: signatureData.procedure.prn,
          organizationId: signatureData.procedure.organization_id,
          processNumber: signatureData.procedure.process_number,
          responsibleGroupId: signatureData.procedure.responsible_group_id,
          requesterId: signatureData.procedure.requester_id,
          createdById: signatureData.procedure.created_by_id,
          procedureTemplateName:
            signatureData.procedure.procedure_template_name,
          procedureTemplateId: signatureData.procedure.procedure_template_id,
          source: signatureData.procedure.source,
          status: signatureData.procedure.status,
          schema: signatureData.procedure.schema.map((schemaItem) => {
            return {
              label: schemaItem.label,
              fieldType: schemaItem.field_type,
              options: schemaItem.options,
            };
          }),
          payload: signatureData.procedure.payload.map((payloadItem) => {
            return {
              label: payloadItem.label,
              fieldType: payloadItem.field_type,
              value: payloadItem.value,
              options: payloadItem.options,
            };
          }),
          createdAt: signatureData.created_at,
          updatedAt: signatureData.updated_at,
        },
        requester: {
          id: signatureData.requester.id,
          name: signatureData.requester.name,
          organizationId: signatureData.requester.organization_id,
          parentGroupId: signatureData.requester.parent_group_id || null,
          cpfCnpj: signatureData.requester.cpf_cnpj,
          prn: signatureData.requester.prn,
          code: signatureData.requester.code || null,
          email: signatureData.requester.email,
          optionalEmail: signatureData.requester.optional_email || null,
          type: signatureData.requester.type,
          status: signatureData.requester.status,
          phone: signatureData.requester.phone,
          optionalPhone: signatureData.requester.optional_phone || null,
          occupation: signatureData.requester.occupation || null,
          birthDate: signatureData.requester.birth_date,
          createdAt: signatureData.requester.created_at,
          updatedAt: signatureData.requester.updated_at,
        },
        createdBy: {
          id: signatureData.created_by.id,
          name: signatureData.created_by.name,
          email: signatureData.created_by.email,
          cpf: signatureData.created_by.cpf,
          dateOfBirth: signatureData.created_by.date_of_birth,
          avatarUrl: signatureData.created_by.avatar_url,
          organizationId: signatureData.created_by.organization_id,
          phone: signatureData.created_by.phone,
          prn: signatureData.created_by.prn,
          status: signatureData.created_by.status,
          username: signatureData.created_by.username,
          changedPassword: signatureData.created_by.changed_password,
          registrationNumber:
            signatureData.created_by.registration_number || null,
          createdAt: signatureData.created_by.created_at,
          updatedAt: signatureData.created_by.updated_at,
          deletedAt: signatureData.created_by.deleted_at || null,
        },
        signable: {
          id: signatureData.signable.id,
          status: signatureData.signable.status,
          procedureId: signatureData.signable.procedure_id,
          s3Key: signatureData.signable.s3_key,
          name: signatureData.signable.name,
          signedDocumentId: signatureData.signable.signed_document_id || null,
          documentId: signatureData.signable.document_id,
          uuid: signatureData.signable.uuid,
          createdById: signatureData.signable.created_by_id,
          createdAt: signatureData.signable.created_at,
          updatedAt: signatureData.signable.updated_at,
          documentUrl: signatureData.signable.document_url,
        },
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

  let queryString = new URLSearchParams(
    camelToSnake(req.query) as Record<string, string>
  ).toString();

  queryString = queryString.replace('status=created', 'status[]=created');
  queryString = queryString.replace('status=signed', 'status[]=signed');
  queryString = queryString.replace('status=running', 'status[]=running');
  queryString = queryString.replace('status=refused', 'status[]=refused');
  queryString = queryString.replace(
    'status=inProgress',
    'status[]=signed&status[]=running'
  );

  switch (req.method) {
    case 'GET':
      return client
        .get(`/v3/printer_flow/signatures?${queryString}`, config)
        .then((response) => {
          res.status(response.status).json(transformData(response.data));
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
          `/v3/printer_flow/signatures`,
          {
            requester_ids: req.body.requesterIds,
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
