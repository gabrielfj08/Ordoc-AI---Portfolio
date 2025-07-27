import { RemoveRequesterFromGroupAPIResponse } from '../../../../services/printer-flow/types';

export interface RemoveRequesterContainerModalProps {
  groupId: number;
  groupName: string;
  requesterId: number;
  requesterName: string;
}

export interface RemoveRequesterModalProps {
  onSubmit: () => Promise<RemoveRequesterFromGroupAPIResponse>;
  groupName: string;
  requesterName: string;
}
