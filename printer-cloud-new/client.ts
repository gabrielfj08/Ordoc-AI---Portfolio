import axios from 'axios';
import getConfig from 'next/config';

const client = axios.create({
  baseURL: getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL,
});

export default client;
