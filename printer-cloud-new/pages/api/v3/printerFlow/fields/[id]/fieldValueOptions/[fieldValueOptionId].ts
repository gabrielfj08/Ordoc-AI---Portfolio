import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../../../../client';
import { camelToSnake } from '../../../../../../../utils';
import { BaseFieldValueOption } from '../../../../../../../services/printer-flow/types';

const transformData = (data): BaseFieldValueOption => {
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
          `/v3/printer_flow/fields/${req.query.id}/field_value_options/${req.query.fieldValueOptionId}`,
          config
        )
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
    case 'PUT':
      return client
        .put(
          `/v3/printer_flow/fields/${req.query.id}/field_value_options/${req.query.fieldValueOptionId}`,
          camelToSnake(req.body),
          config
        )
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
    case 'DELETE':
      return client
        .delete(
          `/v3/printer_flow/fields/${req.query.id}/field_value_options/${req.query.fieldValueOptionId}`,
          config
        )
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
  }
}
