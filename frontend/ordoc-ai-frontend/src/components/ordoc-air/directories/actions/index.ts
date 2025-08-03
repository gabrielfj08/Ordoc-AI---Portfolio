import { directoriesService } from '@/services/ordoc-air/directories';
import type {
  CreateDirectoryPayload,
  UpdateDirectoryPayload,
  CreateDirectoryAPIResponse,
  UpdateDirectoryAPIResponse,
} from '@/types/ordoc-air/directory';

export const createDirectory = (
  payload: CreateDirectoryPayload
): Promise<CreateDirectoryAPIResponse> => {
  return directoriesService.create(payload);
};

export const updateDirectory = (
  id: number,
  payload: UpdateDirectoryPayload
): Promise<UpdateDirectoryAPIResponse> => {
  return directoriesService.update(id, payload);
};

export const deleteDirectory = (id: number): Promise<void> => {
  return directoriesService.delete(id);
};
