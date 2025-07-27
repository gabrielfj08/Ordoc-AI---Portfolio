import { IndexAppsAPIResponse } from '../../../services/types';

export interface AppsRadioGroupContainerProps {
  disabled?: boolean;
}

export interface AppsRadioGroupProps {
  apps: IndexAppsAPIResponse;
  disabled?: boolean;
}
