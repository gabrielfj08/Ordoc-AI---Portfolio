import { ShowExternalRequesterAPIResponse } from '../../../../services/flow-cidadao/types';
import { themeColors } from '../../../../services/types/organization';

export interface EditExternalRequesterProfileContainerProps {
  externalRequester: ShowExternalRequesterAPIResponse;
  color: string;
}

export interface EditExternalRequesterProfileProps {
  externalRequester: ShowExternalRequesterAPIResponse;
  color: string;
}
