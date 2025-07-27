import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../client';
import {
  ShowDocumentAPIResponse,
  UpdateDocumentAPIResponse,
} from '../../../../../services/printer-air/types';

const transformShowData = (data): ShowDocumentAPIResponse => {
  return {
    id: data.id,
    originalFilename: data.original_filename,
    status: data.status,
    description: data.description,
    location: data.location,
    directoryId: data.directory_id,
    path: data.path,
    prn: data.prn,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    deletedAt: data.deleted_at,
    url: data.url,
    downloadUrl: data.download_url,
    content: data.content,
    size: data.size,
    byteSize: data.byte_size,
    createdBy: {
      id: data.created_by.id,
      email: data.created_by.email,
      name: data.created_by.name,
      createdAt: data.created_by.created_at,
      updatedAt: data.created_by.updated_at,
      phone: data.created_by.phone,
      cpf: data.created_by.cpf,
      deletedAt: data.created_by.deleted_at,
      dateOfBirth: data.created_by.date_of_birth,
      unlockTokenSentAt: data.created_by.unlock_token_sent_at,
      status: data.created_by.status,
      prn: data.created_by.prn,
    },
    updatedBy: data.updated_by,
    directory: {
      name: data.directory.name,
    },
  };
};

const transformUpdateData = (data): UpdateDocumentAPIResponse => {
  return {
    id: data.id,
    originalFilename: data.original_filename,
    status: data.status,
    description: data.description,
    location: data.location,
    directoryId: data.directory_id,
    path: data.path,
    prn: data.prn,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    deletedAt: data.deleted_at,
    url: data.url,
    content: data.content,
    size: data.size,
    createdBy: {
      id: data.created_by.id,
      email: data.created_by.email,
      name: data.created_by.name,
      createdAt: data.created_by.created_at,
      updatedAt: data.created_by.updated_at,
      phone: data.created_by.phone,
      cpf: data.created_by.cpf,
      deletedAt: data.created_by.deleted_at,
      dateOfBirth: data.created_by.date_of_birth,
      unlockTokenSentAt: data.created_by.unlock_token_sent_at,
      status: data.created_by.status,
      prn: data.created_by.prn,
    },
    updatedBy: data.updated_by,
    directory: {
      name: data.directory.name,
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
        .get(`/v3/printer_air/documents/${req.query.documentId}`, config)
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
    case 'PUT':
      return client
        .put(
          `/v3/printer_air/documents/${req.query.documentId}`,
          {
            document: {
              description: req.body.description,
              location: req.body.location,
              original_filename: req.body.originalFilename,
            },
          },
          config
        )
        .then((response) => {
          res.status(response.status).json(transformUpdateData(response.data));
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
