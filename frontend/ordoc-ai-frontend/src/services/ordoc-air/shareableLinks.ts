import api from '@/services/auth';
import type {
  ShareableLink,
  CreateShareableLinkPayload,
} from '@/types/ordoc-air/shareableLink';

const baseUrl = '/api/v1/ordoc-air/shareable-links/';

const list = async (
  objectType: 'document' | 'directory',
  objectId: number
): Promise<ShareableLink[]> => {
  const params = { [objectType]: objectId } as Record<string, any>;
  const response = await api.get(baseUrl, { params });
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  if (Array.isArray(data.shareableLinks)) return data.shareableLinks;
  return [];
};

const create = async (
  objectType: 'document' | 'directory',
  objectId: number,
  payload: CreateShareableLinkPayload
): Promise<ShareableLink> => {
  const data = { ...payload, [objectType]: objectId } as Record<string, any>;
  const response = await api.post(baseUrl, data);
  return response.data;
};

const destroy = async (id: string): Promise<void> => {
  await api.delete(`${baseUrl}${id}/`);
};

const showByToken = async (token: string): Promise<ShareableLink> => {
  const response = await api.get(`${baseUrl}by_token/`, { params: { token } });
  return response.data;
};

export const shareableLinksService = {
  list,
  create,
  destroy,
  showByToken,
};

export default shareableLinksService;

