import axios from 'axios';

const index = (id: number, subdomain: string, name: string, token: string) => {
  return axios.get(`/api/v3/Reports/Organizations/${id}/reports?name=${name}`, {
    headers: { token, 'X-Api-Subdomain': subdomain },
  });
};

export const ReportService = {
  index,
};
