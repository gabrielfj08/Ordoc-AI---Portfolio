import axios from 'axios';

const get = (cep: string) => {
  return axios.post('/api/organizations/postalCodeAPI', { cep });
};

const CepPromise = {
  get,
};

export default CepPromise;
