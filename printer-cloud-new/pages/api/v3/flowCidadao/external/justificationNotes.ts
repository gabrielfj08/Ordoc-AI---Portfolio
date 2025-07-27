import client from '../../../../../client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { IndexExternalJustificationNotesAPIResponse } from '../../../../../services/flow-cidadao/types';
import { camelToSnake } from '../../../../../utils';

const transformIndexData = (
  data
): IndexExternalJustificationNotesAPIResponse => {
  return {
    justificationNotes: data['printer_flow/justification_notes'].map(
      (justificationNoteData) => {
        return {
          id: justificationNoteData.id,
          note: justificationNoteData.note,
          createdById: justificationNoteData.created_by_id,
          action: justificationNoteData.action,
          justifiableType: justificationNoteData.justifiable_type,
          justifiableId: justificationNoteData.justifiable_id,
          createdAt: justificationNoteData.created_at,
          updatedAt: justificationNoteData.updated_at,
          createdBy: {
            id: justificationNoteData.created_by.id,
            name: justificationNoteData.created_by.name,
            organizationId: justificationNoteData.created_by.organization_id,
            parentGroupId: justificationNoteData.created_by.parent_group_id,
            cpfCnpj: justificationNoteData.created_by.cpf_cnpj,
            prn: justificationNoteData.created_by.prn,
            code: justificationNoteData.created_by.code,
            email: justificationNoteData.created_by.email,
            optionalEmail: justificationNoteData.created_by.optional_email,
            type: justificationNoteData.created_by.type,
            status: justificationNoteData.created_by.status,
            blocked: justificationNoteData.created_by.blocked,
            phone: justificationNoteData.created_by.phone,
            optionalPhone: justificationNoteData.created_by.optional_phone,
            occupation: justificationNoteData.created_by.occupation,
            birthDate: justificationNoteData.created_by.birth_date,
            createdAt: justificationNoteData.created_by.created_at,
            updatedAt: justificationNoteData.created_by.updated_at,
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

  switch (req.method) {
    case 'GET':
      return client
        .get(
          `/v3/printer_flow/external/justification_notes?${queryString}`,
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
  }
}
