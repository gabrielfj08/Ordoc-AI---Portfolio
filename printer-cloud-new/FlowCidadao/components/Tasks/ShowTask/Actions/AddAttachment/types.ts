import { ShowExternalTaskAPIResponse } from '../../../../../../services/flow-cidadao/types';

export interface AddExternalAttachmentModalProps {
  task: ShowExternalTaskAPIResponse;
  onSubmit: (values) => void;
  setAttachmentModalVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}
