import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../../../client';
import {
  CreateShareableLinkAPIResponse,
  IndexShareableLinkAPIResponse,
} from '../../../../../../../../services/printer-air/types';

const transformCreateData = (data): CreateShareableLinkAPIResponse => {
  return {
    id: data.id,
    uuid: data.uuid,
    expiresIn: data.expires_in,
    expiresAt: data.expires_at,
    documentPrn: data.document_prn,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    link: data.link,
  };
};

const transformIndexData = (data): IndexShareableLinkAPIResponse => {
  return {
    shareableLinks: data['printer_air/shareable_links'].map(
      (shareableLinkData) => {
        return {
          id: shareableLinkData.id,
          uuid: shareableLinkData.uuid,
          expiresIn: shareableLinkData.expires_in,
          expiresAt: shareableLinkData.expires_at,
          documentPrn: shareableLinkData.document_prn,
          createdAt: shareableLinkData.created_at,
          updatedAt: shareableLinkData.updated_at,
          link: shareableLinkData.link,
          createdById: shareableLinkData.created_by_id,
          createdBy: shareableLinkData.created_by
            ? {
                id: shareableLinkData.created_by.id,
                name: shareableLinkData.created_by.name,
                email: shareableLinkData.created_by.email,
                cpf: shareableLinkData.created_by.cpf,
                dateOfBirth: shareableLinkData.created_by.date_of_birth,
                avatarUrl: shareableLinkData.created_by.avatar_url,
                organizationId: shareableLinkData.created_by.organization_id,
                phone: shareableLinkData.created_by.phone,
                prn: shareableLinkData.created_by.prn,
                status: shareableLinkData.created_by.status,
                username: shareableLinkData.created_by.username,
                changedPassword: shareableLinkData.created_by.changed_password,
                registrationNumber:
                  shareableLinkData.created_by.registration_number,
                createdAt: shareableLinkData.created_by.created_at,
                updatedAt: shareableLinkData.created_by.updated_at,
                deletedAt: shareableLinkData.created_by.deleted_at,
              }
            : null,
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

  switch (req.method) {
    case 'GET':
      return client
        .get(
          `/v3/printer_air/organizations/${req.query.organizationId}/documents/${req.query.documentId}/shareable_links`,
          config
        )
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
          `/v3/printer_air/organizations/${req.query.organizationId}/documents/${req.query.documentId}/shareable_links`,
          {
            shareable_link: {
              expires_in: req.body.expiresIn,
            },
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
