import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../client';
import { camelToSnake } from '../../../../../../utils';
import {
  IndexFieldValueOptions,
  BaseFieldValueOption,
} from '../../../../../../services/printer-flow/types';

const transformIndexData = (data): IndexFieldValueOptions => {
  return {
    fieldValueOptions: data['printer_flow/field_value_options'].map(
      (fieldValueOption) => {
        return {
          id: fieldValueOption.id,
          fieldId: fieldValueOption.field_id,
          value: fieldValueOption.value,
          createdAt: fieldValueOption.created_at,
          updatedAt: fieldValueOption.updated_at,
        };
      }
    ),
    meta: {
      total: data.meta.total,
    },
  };
};

const transformCreateData = (data): BaseFieldValueOption => {
  return {
    id: data.id,
    fieldId: data.field_id,
    value: data.value,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = {
    headers: {
      Authorization: `Bearer ${req.headers.token}`,
      'X-Api-Subdomain': req.headers['x-api-subdomain'] as string,
    },
  };

  switch (req.method) {
    case 'GET':
      return client
        .get(
          `/v3/printer_flow/fields/${req.query.id}/field_value_options`,
          config
        )
        .then((response) => {
          res.status(response.status).json(transformIndexData(response.data));
        })
        .catch((error) => {
          res.status(error.response.status).json(error.response.data);
        });
    case 'POST':
      return client
        .post(
          `/v3/printer_flow/fields/${req.query.id}/field_value_options`,
          camelToSnake(req.body),
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
