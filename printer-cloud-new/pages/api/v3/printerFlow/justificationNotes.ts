import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../client';
import { camelToSnake } from '../../../../utils';
import { IndexJustificationNotes } from '../../../../services/printer-flow/types';

const transformIndexData = (data): IndexJustificationNotes => {
  return {
    justificationNotes: data['printer_flow/justification_notes'].map(
      (justificationNotesData) => {
        return {
          id: justificationNotesData.id,
          note: justificationNotesData.note,
          createdById: justificationNotesData.created_by_id,
          action: justificationNotesData.action,
          justifiableId: justificationNotesData.justifiable_id,
          justifiableType: justificationNotesData.justifiable_type,
          createdAt: justificationNotesData.created_at,
          updatedAt: justificationNotesData.updated_at,
          createdBy: {
            id: justificationNotesData.created_by.id,
            organizationId: justificationNotesData.created_by.organization_id,
            name: justificationNotesData.created_by.name,
            email: justificationNotesData.created_by.email,
            cpfCnpj: justificationNotesData.created_by.cpf_cnpj,
            status: justificationNotesData.created_by.status,
            prn: justificationNotesData.created_by.prn,
            createdAt: justificationNotesData.created_by.created_at,
            updatedAt: justificationNotesData.created_by.updated_at,
            code: justificationNotesData.created_by.code,
            parentGroupId: justificationNotesData.created_by.parent_group_id,
            phone: justificationNotesData.created_by.phone,
            optionalPhone: justificationNotesData.created_by.optional_phone,
            birthDate: justificationNotesData.created_by.birth_date,
            optionalEmail: justificationNotesData.created_by.optional_email,
            occupation: justificationNotesData.created_by.occupation,
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

  const queryString = new URLSearchParams(
    camelToSnake(req.query) as Record<string, string>
  ).toString();

  return client
    .get(`/v3/printer_flow/justification_notes?${queryString}`, config)
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
