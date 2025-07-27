import { MeAPIResponse } from '../../../../services/types';
import { EditProfileFormValues } from '../Edit/types';

export interface AvatarContainerProps {
  user: MeAPIResponse;
  onSubmit: (s3Url: string) => void;
  onClick: React.MouseEventHandler;
}
export interface AvatarProps {
  onClick: React.MouseEventHandler;
  user: EditProfileFormValues;
}
