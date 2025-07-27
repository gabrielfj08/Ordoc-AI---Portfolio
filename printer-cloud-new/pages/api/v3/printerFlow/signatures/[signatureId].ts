import client from '../../../../../client';
import { camelToSnake } from '../../../../../utils';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  ShowSignatureAPIResponse,
  DeleteSignatureAPIResponse,
} from '../../../../../services/printer-flow/types';

const transformShowData = (data): ShowSignatureAPIResponse => {
  return {
    id: data.id,
    signableId: data.signable_id,
    signableType: data.signable_type,
    requesterId: data.requester_id,
    status: data.status,
    service: data.service,
    token: data.token,
    procedureId: data.procedure_id || null,
    createdById: data.created_by_id || null,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    requester: {
      id: data.requester.id,
      name: data.requester.name,
      organizationId: data.requester.organization_id,
      parentGroupId: data.requester.parent_group_id || null,
      cpfCnpj: data.requester.cpf_cnpj,
      prn: data.requester.prn,
      code: data.requester.code || null,
      email: data.requester.email,
      optionalEmail: data.requester.optional_email || null,
      type: data.requester.type,
      status: data.requester.status,
      phone: data.requester.phone,
      optionalPhone: data.requester.optional_phone || null,
      occupation: data.requester.occupation || null,
      birthDate: data.requester.birth_date,
      createdAt: data.requester.created_at,
      updatedAt: data.requester.updated_at,
    },
    signable: {
      id: data.signable.id,
      status: data.signable.status,
      procedureId: data.signable.procedure_id,
      s3Key: data.signable.s3_key,
      name: data.signable.name,
      signedDocumentId: data.signable.signed_document_id || null,
      documentId: data.signable.document_id,
      uuid: data.signable.uuid,
      createdById: data.signable.created_by_id,
      createdAt: data.signable.created_at,
      updatedAt: data.signable.updated_at,
      documentUrl: data.signable.document_url,
    },
  };
};

const transformDeleteData = (data): DeleteSignatureAPIResponse => {
  return {
    id: data.id,
    signableId: data.signable_id,
    signableType: data.signable_type,
    requesterId: data.requester_id,
    status: data.status,
    service: data.service,
    token: data.token,
    procedureId: data.procedure_id || null,
    createdById: data.created_by_id || null,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    signable: {
      id: data.signable.id,
      status: data.signable.status,
      procedureId: data.signable.procedure_id,
      s3Key: data.signable.s3_key,
      name: data.signable.name,
      signedDocumentId: data.signable.signed_document_id || null,
      documentId: data.signable.document_id,
      uuid: data.signable.uuid,
      createdById: data.signable.created_by_id,
      createdAt: data.signable.created_at,
      updatedAt: data.signable.updated_at,
      documentUrl: data.signable.document_url,
    },
    requester: {
      id: data.requester.id,
      name: data.requester.name,
      organizationId: data.requester.organization_id,
      parentGroupId: data.requester.parent_group_id || null,
      cpfCnpj: data.requester.cpf_cnpj,
      prn: data.requester.prn,
      code: data.requester.code || null,
      email: data.requester.email,
      optionalEmail: data.requester.optional_email || null,
      type: data.requester.type,
      status: data.requester.status,
      phone: data.requester.phone,
      optionalPhone: data.requester.optional_phone || null,
      occupation: data.requester.occupation || null,
      birthDate: data.requester.birth_date,
      createdAt: data.requester.created_at,
      updatedAt: data.requester.updated_at,
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
        .get(`/v3/printer_flow/signatures/${req.query.signatureId}`, config)
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
        .delete(`/v3/printer_flow/signatures/${req.query.signatureId}`, config)
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
