import axios from 'axios';

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return axios
    .post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${req.body.secret}&response=${req.body.token}`
    )
    .then((response) => {
      res.status(response.status).json(response.data);
    })
    .catch((error) => {
      res.status(error.response.status).json(error.response.data);
    });
}
