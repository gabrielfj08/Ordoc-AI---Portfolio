import { UpdateGroupRequesterAPIResponse } from '../../../services/printer-flow/types';

export interface EditGroupContainerProps {
  groupId: number;
  name: string;
  setUpdateGroup: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface EditGroupProps {
  onSubmit: (
    values: EditGroupFormValues
  ) => Promise<UpdateGroupRequesterAPIResponse>;
  name: string;
}

export interface EditGroupFormValues {
  name: string;
}
