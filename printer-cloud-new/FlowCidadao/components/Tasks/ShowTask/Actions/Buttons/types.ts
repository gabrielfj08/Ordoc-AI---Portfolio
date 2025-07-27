import {
  ShowExternalTaskAPIResponse,
  taskExternalStatus,
} from '../../../../../../services/flow-cidadao/types';

export interface ShowExternalButtonsModalProps {
  task: ShowExternalTaskAPIResponse;
  justificationModalVisibility: boolean;
  setJustificationModalVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export interface AddExternalCommentModalContainerProps {
  status: taskExternalStatus;
  task: ShowExternalTaskAPIResponse;
  justificationModalVisibility: boolean;
  setJustificationModalVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}
