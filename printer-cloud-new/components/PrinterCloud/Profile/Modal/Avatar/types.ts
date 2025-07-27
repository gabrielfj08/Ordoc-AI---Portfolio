import { MeAPIResponse } from '../../../../../services/types';
export interface AvatarProps {
  onSubmit: (avatarFile: File) => void;
  user: MeAPIResponse;
}
export interface AvatarFormValues {
  avatarFile: File | null;
}
